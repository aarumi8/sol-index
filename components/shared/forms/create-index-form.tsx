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
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';

const CreateIndexForm: React.FC = () => {
  const { toast } = useToast();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();

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
    setIsLoading(true);
    setError(null);

    const loadingToast = toast({
      title: "Creating Index",
      description: <div className="flex items-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing your request...</div>,
      duration: Infinity,
    });

    try {
      const result = await createIndex(data);
      loadingToast.dismiss();
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
        });
        form.reset(); // Reset form after successful submission
        router.push('/');
      } else {
        setError(result.error);
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating index:', error);
      loadingToast.dismiss();
      setError('An unexpected error occurred');
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Title text="Create New Index" className='font-extrabold mb-4' />
        
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
                    <Input placeholder="Type correct token address on Solana" {...field} />
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
              <Button type="button" variant="destructive" onClick={() => remove(index)} disabled={isLoading}>
                Remove
              </Button>
            )}
          </div>
        ))}
        
        <Button type="button" variant="secondary" onClick={() => append({ address: "", percentage: 0 })} disabled={isLoading}>
          Add Token
        </Button>
        
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Index...
            </>
          ) : (
            'Create Index'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default CreateIndexForm;