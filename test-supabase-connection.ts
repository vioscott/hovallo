import { supabase } from './src/utils/supabase';

async function testSupabaseConnection() {
    console.log('=== Testing Supabase Connection ===\n');

    // Check if environment variables are loaded
    console.log('Environment Variables:');
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing');
    console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set (length: ' + import.meta.env.VITE_SUPABASE_ANON_KEY?.length + ')' : '✗ Missing');
    console.log('');

    // Test 1: Check Supabase client initialization
    console.log('Test 1: Supabase Client');
    console.log('Client initialized:', supabase ? '✓' : '✗');
    console.log('');

    // Test 2: Test database connection with a simple query
    console.log('Test 2: Database Connection');
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count')
            .limit(1);

        if (error) {
            console.log('✗ Database query failed');
            console.log('Error:', error.message);
            console.log('Details:', error);
        } else {
            console.log('✓ Database connection successful');
            console.log('Query executed successfully');
        }
    } catch (err: any) {
        console.log('✗ Database connection failed');
        console.log('Error:', err.message);
    }
    console.log('');

    // Test 3: Test auth session
    console.log('Test 3: Auth Session');
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
            console.log('✗ Auth session check failed');
            console.log('Error:', error.message);
        } else {
            console.log('✓ Auth session check successful');
            console.log('Current session:', session ? 'User logged in' : 'No active session');
        }
    } catch (err: any) {
        console.log('✗ Auth session check failed');
        console.log('Error:', err.message);
    }
    console.log('');

    // Test 4: Test a login attempt with dummy credentials (will fail but shows connection works)
    console.log('Test 4: Auth API Test (with invalid credentials)');
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'test@example.com',
            password: 'Test123!@#',
        });

        if (error) {
            console.log('✓ Auth API is responding');
            console.log('Expected error (invalid credentials):', error.message);
        } else {
            console.log('✓ Login successful (unexpected - user exists!)');
            console.log('User:', data.user?.email);
        }
    } catch (err: any) {
        console.log('✗ Auth API connection failed');
        console.log('Error:', err.message);
    }
    console.log('');

    console.log('=== Test Complete ===');
}

testSupabaseConnection();
