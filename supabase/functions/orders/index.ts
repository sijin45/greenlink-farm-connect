
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

    const { method } = req
    const url = new URL(req.url)
    const orderId = url.searchParams.get('id')

    switch (method) {
      case 'GET':
        const { data: user } = await supabaseClient.auth.getUser()
        if (!user.user) {
          throw new Error('Unauthorized')
        }

        if (orderId) {
          // Get single order with items
          const { data, error } = await supabaseClient
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (
                  name,
                  price,
                  image_url
                )
              ),
              profiles:customer_id (
                username,
                email
              )
            `)
            .eq('id', orderId)
            .eq('customer_id', user.user.id)
            .single()

          if (error) throw error
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        } else {
          // Get all orders for user
          const { data, error } = await supabaseClient
            .from('orders')
            .select(`
              *,
              order_items (
                *,
                products (
                  name,
                  price,
                  image_url
                )
              )
            `)
            .eq('customer_id', user.user.id)
            .order('created_at', { ascending: false })

          if (error) throw error
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

      case 'POST':
        // Create new order
        const { items, total_amount } = await req.json()
        
        const { data: user2 } = await supabaseClient.auth.getUser()
        if (!user2.user) {
          throw new Error('Unauthorized')
        }

        // Start transaction
        const { data: order, error: orderError } = await supabaseClient
          .from('orders')
          .insert({
            customer_id: user2.user.id,
            total_amount,
            status: 'pending',
            payment_status: 'pending'
          })
          .select()
          .single()

        if (orderError) throw orderError

        // Insert order items
        const orderItems = items.map((item: any) => ({
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price
        }))

        const { data: insertedItems, error: itemsError } = await supabaseClient
          .from('order_items')
          .insert(orderItems)
          .select()

        if (itemsError) throw itemsError

        // Update product quantities
        for (const item of items) {
          const { error: updateError } = await supabaseClient
            .from('products')
            .update({ 
              quantity: supabaseClient.sql`quantity - ${item.quantity}` 
            })
            .eq('id', item.product_id)

          if (updateError) {
            console.error('Error updating product quantity:', updateError)
          }
        }

        return new Response(JSON.stringify({ order, items: insertedItems }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'PUT':
        // Update order status
        if (!orderId) {
          throw new Error('Order ID is required for updates')
        }

        const { status, payment_status } = await req.json()
        const updateData: any = {}
        
        if (status) updateData.status = status
        if (payment_status) updateData.payment_status = payment_status

        const { data: updatedOrder, error: updateError } = await supabaseClient
          .from('orders')
          .update(updateData)
          .eq('id', orderId)
          .select()
          .single()

        if (updateError) throw updateError
        return new Response(JSON.stringify(updatedOrder), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response('Method not allowed', { status: 405 })
    }
  } catch (error) {
    console.error('Orders function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
