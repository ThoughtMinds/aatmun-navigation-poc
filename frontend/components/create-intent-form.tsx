"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  chroma_id: z.string().optional(),
})

interface CreateIntentFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void
  isLoading: boolean
}

export function CreateIntentForm({ onSubmit, isLoading }: CreateIntentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      chroma_id: "",
    },
  })

  function handleFormSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter intent name" {...field} />
              </FormControl>
              <FormDescription>This is the name of the intent.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter intent description." className="resize-none" {...field} />
              </FormControl>
              <FormDescription>Describe the intent in detail.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="chroma_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chroma ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter Chroma ID" {...field} value={field.value || ""} />
              </FormControl>
              <FormDescription>An optional ID for ChromaDB integration.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Intent"}
        </Button>
      </form>
    </Form>
  )
}
