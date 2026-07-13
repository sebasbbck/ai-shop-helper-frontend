import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginForm from "@/features/auth/components/LoginForm"
import LoginPage from '../src/app/(auth)/login/page'
import { Form } from 'react-hook-form'


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


*/