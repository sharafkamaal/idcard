import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function MultiBranchFields({ form }: { form: any }) {
  return (
    <>
      <div>
        <FormLabel className="mb-2 text-sm text-gray-700 font-medium">
          Head Office Address <span className="text-red-500">*</span>
        </FormLabel>
        <FormField
          control={form.control}
          name="headOfficeAddress"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Enter head office address"
                  {...field}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <div>
        <FormLabel className="mb-2 text-sm text-gray-700 font-medium">
          No. of Branches <span className="text-red-500">*</span>
        </FormLabel>
        <FormField
          control={form.control}
          name="numBranches"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min={2}
                  placeholder="Enter number of branches"
                  {...field}
                  className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      {/* Add more multi-branch specific fields as needed */}
    </>
  );
}
