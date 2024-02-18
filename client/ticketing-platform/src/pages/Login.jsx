import React from 'react';

export default function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 background: bg-primary">
            <div className="max-w-3xl w-full space-y-8">
                <div>
                    <h2 className="mt-2 text-center text-4xl font-extrabold text-white">Sign in to your account</h2>
                </div>
                <form className="mt-4 space-y-6" action="#" method="POST">
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input id="email-address" name="email" type="email" autoComplete="email" required className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-xl text-gray-900 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10" placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input id="password" name="password" type="password" autoComplete="current-password" required className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-xl text-gray-900 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10" placeholder="Password" />
                        </div>
                    </div>

                    <div className="text-center text-sm">
                        <a href="#" className="font-medium text-secondary hover:bg-teal-700 hover:text-white py-2 px-4 rounded">
                            Forgot your password?
                        </a>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-primary hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
