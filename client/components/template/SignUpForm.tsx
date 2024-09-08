"use client"

import React from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signUpSchema } from "@/schema/auth.schema"
import { InputWithErrorMessage } from "../ui/Input"

type FormFields = {
  username: string
  password: string
  confirmPassword: string
  fullName: string
  gender: "boy" | "girl"
}

const SignUpForm = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormFields>({ resolver: zodResolver(signUpSchema) })

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setError("root", {
        message: "This email is already taken",
      })
      console.log(data)
    } catch (error) {}
  }

  return (
    <div className="flex flex-col">
      <h1 className="text-4xl">Get started</h1>
      <h4>Create new account</h4>

      <button className="btn mb-3 mt-6">Continue with Github</button>
      <button className="btn">Continue with Goggle</button>

      <div className="divider my-6">or</div>

      <form className="w-80" onSubmit={handleSubmit(onSubmit)}>
        <InputWithErrorMessage
          message={errors.username?.message}
          type="text"
          placeholder="fullName"
          className="w-full"
          {...register("fullName")}
        />
        <InputWithErrorMessage
          message={errors.username?.message}
          type="text"
          placeholder="username"
          className="w-full"
          {...register("username")}
        />
        <InputWithErrorMessage
          message={errors.password?.message}
          type="password"
          placeholder="password"
          className="w-full"
          {...register("password")}
        />
        <InputWithErrorMessage
          message={errors.confirmPassword?.message}
          type="password"
          placeholder="confirmPassword"
          className="w-full"
          {...register("confirmPassword")}
        />
        <button disabled={isSubmitting} className="btn btn-primary w-full" type="submit">
          {isSubmitting ? "Loading.." : "Sign Up"}
        </button>
      </form>
    </div>
  )
}

export default SignUpForm
