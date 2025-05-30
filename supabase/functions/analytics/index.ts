
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: user } = await supabaseClient.auth.getUser()
    if (!user.user) {
      throw new Error('Unauthorized')
    }

    const url = new URL(req.url)
    const type = url.searchParams.get('type')

    switch (type) {
      case 'dashboard':
        // Get dashboard analytics
        const [
          { count: totalProducts },
          { count: totalOrders },
          { count: totalUsers },
          { data: recentOrders }
        ] = await Promise.all([
          supabaseClient.from('products').select('*', { count: 'exact', head: true }),
          supabaseClient.from('orders').select('*', { count: 'exact', head: true }),
          supabaseClient.from('profiles').select('*', { count: 'exact', head: true }),
          supabaseClient
            .from('orders')
            .select(`
              *,
              profiles:customer_id (username),
              order_items (
                quantity,
                total_price,
                products (name)
              )
            `)
            .order('created_at', { ascending: false })
            .limit(5)
        ])

        // Calculate total revenue
        const { data: allOrders } = await supabaseClient
          .from('orders')
          .select('total_amount')
          .eq('payment_status', 'completed')

        const totalRevenue = allOrders?.reduce((sum, order) => sum + parseFloat(order.total_amount), 0) || 0

        return new Response(JSON.stringify({
          totalProducts,
          totalOrders,
          totalUsers,
          totalRevenue,
          recentOrders
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'sales':
        // Get sales analytics
        const { data: salesData } = await supabaseClient
          .from('orders')
          .select(`
            created_at,
            total_amount,
            status,
            payment_status,
            order_items (
              quantity,
              products (category)
            )
          `)
          .order('created_at', { ascending: false })

        return new Response(JSON.stringify(salesData), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'products':
        // Get product analytics
        const { data: productAnalytics } = await supabaseClient
          .from('products')
          .select(`
            *,
            order_items (
              quantity,
              total_price
            )
          `)

        const productStats = productAnalytics?.map(product => {
          const totalSold = product.order_items?.reduce((sum: number, item: any) => sum + parseFloat(item.quantity), 0) || 0
          const totalRevenue = product.order_items?.reduce((sum: number, item: any) => sum + parseFloat(item.total_price), 0) || 0
          
          return {
            ...product,
            totalSold,
            totalRevenue,
            order_items: undefined // Remove the raw order_items data
          }
        })

        return new Response(JSON.stringify(productStats), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response('Invalid analytics type', { status: 400 })
    }
  } catch (error) {
    console.error('Analytics function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
