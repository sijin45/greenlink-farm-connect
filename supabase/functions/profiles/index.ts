
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
    const profileId = url.searchParams.get('id')

    switch (method) {
      case 'GET':
        const { data: user } = await supabaseClient.auth.getUser()
        if (!user.user) {
          throw new Error('Unauthorized')
        }

        if (profileId) {
          // Get specific profile (for admin or public view)
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', profileId)
            .single()

          if (error) throw error
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        } else {
          // Get current user's profile
          const { data, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.user.id)
            .single()

          if (error) throw error
          return new Response(JSON.stringify(data), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

      case 'PUT':
        // Update profile
        const { data: user2 } = await supabaseClient.auth.getUser()
        if (!user2.user) {
          throw new Error('Unauthorized')
        }

        const updateData = await req.json()
        const targetId = profileId || user2.user.id

        // Ensure user can only update their own profile unless they're admin
        if (targetId !== user2.user.id) {
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('role')
            .eq('id', user2.user.id)
            .single()

          if (profile?.role !== 'admin') {
            throw new Error('Unauthorized to update other profiles')
          }
        }

        const { data, error } = await supabaseClient
          .from('profiles')
          .update(updateData)
          .eq('id', targetId)
          .select()
          .single()

        if (error) throw error
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'DELETE':
        // Delete profile (admin only)
        if (!profileId) {
          throw new Error('Profile ID is required for deletion')
        }

        const { data: user3 } = await supabaseClient.auth.getUser()
        if (!user3.user) {
          throw new Error('Unauthorized')
        }

        const { data: adminProfile } = await supabaseClient
          .from('profiles')
          .select('role')
          .eq('id', user3.user.id)
          .single()

        if (adminProfile?.role !== 'admin') {
          throw new Error('Admin access required')
        }

        const { error: deleteError } = await supabaseClient
          .from('profiles')
          .delete()
          .eq('id', profileId)

        if (deleteError) throw deleteError
        return new Response(JSON.stringify({ message: 'Profile deleted successfully' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response('Method not allowed', { status: 405 })
    }
  } catch (error) {
    console.error('Profiles function error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
