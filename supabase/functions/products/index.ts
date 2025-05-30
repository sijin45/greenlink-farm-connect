
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
    const productId = url.searchParams.get('id')

    switch (method) {
      case 'GET':
        if (productId) {
          // Get single product
          const { data, error } = await supabaseClient
            .from('products')
            .select(`
              *,
              profiles:farmer_id (
                username,
                email
              )
            `)
            .eq('id', productId)
            .single()

          if (error) throw error
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        } else {
          // Get all products
          const { data, error } = await supabaseClient
            .from('products')
            .select(`
              *,
              profiles:farmer_id (
                username,
                email
              )
            `)
            .order('created_at', { ascending: false })

          if (error) throw error
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

      case 'POST':
        // Create new product
        const { name, description, price, quantity, category, unit, image_url } = await req.json()
        
        const { data: user } = await supabaseClient.auth.getUser()
        if (!user.user) {
          throw new Error('Unauthorized')
        }

        const { data, error } = await supabaseClient
          .from('products')
          .insert({
            name,
            description,
            price,
            quantity,
            category,
            unit: unit || 'kg',
            image_url,
            farmer_id: user.user.id
          })
          .select()
          .single()

        if (error) throw error
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'PUT':
        // Update product
        if (!productId) {
          throw new Error('Product ID is required for updates')
        }

        const updateData = await req.json()
        const { data: updateResult, error: updateError } = await supabaseClient
          .from('products')
          .update(updateData)
          .eq('id', productId)
          .select()
          .single()

        if (updateError) throw updateError
        return new Response(JSON.stringify(updateResult), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'DELETE':
        // Delete product
        if (!productId) {
          throw new Error('Product ID is required for deletion')
        }

        const { error: deleteError } = await supabaseClient
          .from('products')
          .delete()
          .eq('id', productId)

        if (deleteError) throw deleteError
        return new Response(JSON.stringify({ message: 'Product deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response('Method not allowed', { status: 405 })
    }
  } catch (error) {
    console.error('Products function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
