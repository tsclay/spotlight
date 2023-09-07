import { NextRequest, NextResponse } from 'next/server'
import PocketBase from 'pocketbase';

export async function middleware(req: NextRequest) {
    // if (req.nextUrl.pathname == '/') {
        // console.log('has the pb auth cookie ', req.cookies.get('pb_auth')?.value)
        const pb = new PocketBase('http://127.0.0.1:8090')
        const pbCookie = `pb_auth=${encodeURIComponent(req.cookies.get('pb_auth')?.value ?? '')}`
        console.log('the pbCookie ', pbCookie)
        pb.authStore.loadFromCookie((pbCookie ?? '')) 

        try {
            // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
            if (!pb.authStore.isValid) {
                throw Error("blah")
            }
            await pb.collection('users').authRefresh();
            console.log('the pb valid check ', pb.authStore.isValid)
            console.log('should redirect')
            // const response = NextResponse.redirect(new URL('/snippets', req.url))
            const response = NextResponse.next()
            return response
        } catch (_) {
            // clear the auth store on failed refresh
            console.log('catch block')
            pb.authStore.clear();
            return NextResponse.redirect(new URL('/', req.url))
        }
        // await pb.collection('users').authRefresh();
        // pb.authStore.loadFromCookie(pbCookie ? `pb_auth=${pbCookie}`)
        console.log('the pb valid check ', pb.authStore.isValid)
        if (pb.authStore.isValid) {
            console.log('should redirect')
            const response = NextResponse.redirect(new URL('/snippets', req.url))
            return response
        }
    // }
    // return NextResponse.next()
}

export const config = {
    matcher: ['/snippets/:path*', '/you/:path*'],
  }
