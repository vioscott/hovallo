import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';

export function SupabaseTestPage() {
    const [results, setResults] = useState<string[]>([]);

    useEffect(() => {
        runTests();
    }, []);

    const addResult = (message: string) => {
        setResults(prev => [...prev, message]);
    };

    const runTests = async () => {
        addResult('=== Supabase Connection Test ===\n');

        // Test 1: Check environment variables
        addResult('Test 1: Environment Variables');
        const url = (import.meta as any).env.VITE_SUPABASE_URL;
        const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;
        addResult(`URL: ${url ? '✓ Set (' + url + ')' : '✗ Missing'}`);
        addResult(`Key: ${key ? '✓ Set (length: ' + key.length + ')' : '✗ Missing'}\n`);

        // Test 2: Database connection
        addResult('Test 2: Database Connection');
        try {
            const { data, error } = await supabase
                .from('users')
                .select('count')
                .limit(1);

            if (error) {
                addResult(`✗ Database Error: ${error.message}`);
                addResult(`Details: ${JSON.stringify(error, null, 2)}`);
            } else {
                addResult('✓ Database connected successfully');
                addResult(`Query result: ${JSON.stringify(data)}`);
            }
        } catch (err: any) {
            addResult(`✗ Exception: ${err.message}`);
        }
        addResult('');

        // Test 3: Auth session check
        addResult('Test 3: Auth Session');
        try {
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                addResult(`✗ Session Error: ${error.message}`);
            } else {
                addResult('✓ Auth API responding');
                addResult(`Session: ${session ? 'User logged in (' + session.user.email + ')' : 'No active session'}`);
            }
        } catch (err: any) {
            addResult(`✗ Exception: ${err.message}`);
        }
        addResult('');

        // Test 4: Test login with dummy credentials
        addResult('Test 4: Login Attempt (test@example.com)');
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: 'test@example.com',
                password: 'Test123!@#',
            });

            if (error) {
                addResult(`Auth Response: ${error.message}`);
                addResult(`Error Code: ${error.status}`);
            } else {
                addResult('✓ Login successful!');
                addResult(`User: ${data.user?.email}`);
            }
        } catch (err: any) {
            addResult(`✗ Exception: ${err.message}`);
        }
        addResult('');

        addResult('=== Test Complete ===');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-green-400 p-8 font-mono">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl mb-6 text-green-300">Supabase Connection Diagnostics</h1>
                <div className="bg-black p-6 rounded-lg border border-green-700">
                    {results.map((result, index) => (
                        <div key={index} className="whitespace-pre-wrap">
                            {result}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
