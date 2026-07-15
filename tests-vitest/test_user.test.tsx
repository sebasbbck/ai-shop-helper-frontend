import { expect, test, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginForm from "@/features/auth/components/LoginForm"
import LoginPage from '../src/app/(auth)/login/page'
import { Form } from 'react-hook-form'
import { vi } from 'vitest'

import { useState } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "@/theme";
import {NextIntlClientProvider} from 'next-intl';



// The ./example.js module will be replaced with
// the result of a factory function, and the
// original ./example.js module will never be called



vi.mock('LoginForm', () => {



  return {

    answer() {

     render(

    <NextIntlClientProvider locale="en" >
      
      <LoginForm/>
    </NextIntlClientProvider>

  );

 
 test('tests the heading', () => {
expect(screen.getByRole('heading', { level: 1, name: 'Iniciar sesión' })).toBeDefined();
})
 

    },

    variable: 'mock',

  }


  
})



interface User {
  email: string
  password: string
}

function createUser(email: string, password: string): User {
  return { email, password }
}

test('creates a user with the correct fields', () => {
  const user = createUser('malikquiros@hotmail.com', '12345678')

  expect(user).toEqual({ email: 'malikquiros@hotmail.com', password: '12345678' })
  expect(user.email).toBe('malikquiros@hotmail.com')
})




/* 

test("Test function that checks if the form is valid", () => {
  expect(values.email).toBe(regex);
});





import { expect, test } from 'vitest'
import { object, regex } from 'zod';
import LoginForm from "@/features/auth/components/LoginForm";
import { describe } from 'zod/v4/core';
import { render, screen } from '@testing-library/react'



test('Login Testing', () => {
  render(<LoginForm/>)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
})






interface User {
  email: string
  password: string
}

function createUser(email: string, password: string): User {
  return { email, password }
}

test('creates a user with the correct fields', () => {
  const user = createUser('malikquiros@hotmail.com', '12345678')

  expect(user).toEqual({ email: 'malikquiros@hotmail.com', password: '12345678' })
  expect(user.email).toBe('malikquiros@hotmail.com')
})




test('Page', () => {
  render(<LoginPage/>)
  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
    
})




it('renders', () => {
  render(
    <NextIntlClientProvider locale="en" >
      
      <LoginForm/>
    </NextIntlClientProvider>
  );

  expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined()
});









vi.mock('LoginForm', () => {

  return {

    answer() {

     render(

    <NextIntlClientProvider locale="en" >
      
      <LoginForm/>
    </NextIntlClientProvider>

  );

 expect(screen.getByRole('heading', { level: 1, name: 'Home' })).toBeDefined();

    },

    variable: 'mock',

  }



  
})







*/