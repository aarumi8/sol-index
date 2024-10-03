'use client';

import React from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createIndexSchema, CreateIndexFormData } from "@/constants/create-index-form-schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { createIndex } from '@/app/actions';
import { Title } from '../base/title';

const CreateIndexForm: React.FC = () => {
  const form = useForm<CreateIndexFormData>({
    resolver: zodResolver(createIndexSchema),
    defaultValues: {
      indexName: "",
      indexTicker: "",
      tokens: [
        { address: "", percentage: 0 },
        { address: "", percentage: 0 }
      ]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "tokens"
  });

  const onSubmit = async (data: CreateIndexFormData) => {
    try {
      const result = await createIndex(data);
      if (result.success) {
        console.log('Index created successfully');
        // Handle success (e.g., show a success message, redirect, etc.)
      } else {
        console.error('Failed to create index');
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error('Error creating index:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Title text="Create New Index" className='font-extrabold mb-4' />
        <FormField
          control={form.control}
          name="indexName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Index Name</FormLabel>
              <FormControl>
                <Input placeholder="My Custom Index" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="indexTicker"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Index Ticker</FormLabel>
              <FormControl>
                <Input placeholder="MCI" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-end space-x-4">
            <FormField
              control={form.control}
              name={`tokens.${index}.address`}
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel>Token Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name={`tokens.${index}.percentage`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Percentage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {index > 1 && (
              <Button type="button" variant="destructive" onClick={() => remove(index)}>
                Remove
              </Button>
            )}
          </div>
        ))}
        
        <Button type="button" variant="secondary" onClick={() => append({ address: "", percentage: 0 })}>
          Add Token
        </Button>
        
        <Button type="submit">Create Index</Button>
      </form>
    </Form>
  );
};

export default CreateIndexForm;