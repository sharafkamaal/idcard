'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { schoolSchema } from '@/schemas/schoolSchema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import IdCardPreviewModal from '@/components/IdCardPreviewModal';

type SchoolFormValues = z.infer<typeof schoolSchema>;

export function AddSchoolForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState('');
  const [idCardPreview, setIdCardPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const idCardInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      schoolType: 'single',
      schoolName: '',
      phoneNo: '',
      altPhoneNo: '',
      address: '',
      city: '',
      state: '',
      pinCode: '',
      schoolPointOfContact: '',
      pointOfContactPhone: '',
      status: 'active',
      verified: false,
      logoUrl: '',
      idCardDesignUrl: '',
      selectLayoutOfIdCard: 'vertical_id',
      sessionDisplayOnCard: true,
      pdfDownloadAccess: true,
      idCardsNoType: 'Roll No',
      session: '',
    },
  });

  const schoolName = form.watch('schoolName');

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImagePreview: (value: string) => void,
    fieldName: keyof SchoolFormValues
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      form.setValue(fieldName, result);
    };
    reader.readAsDataURL(file);
  };

  async function onSubmit(data: SchoolFormValues) {
    setLoading(true);
    try {
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        setShowModal(true);
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to add school',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to add school',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleModalClose = () => {
    setShowModal(false);
    form.reset();
    setLogoPreview('');
    setIdCardPreview('');
  };

  return (
    <>
      <div className="flex justify-center items-start w-full min-h-screen p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row w-full max-w-7xl gap-6">
            {/* Logo Left */}
            <div className="flex-shrink-0 flex flex-col items-center w-48">
              <div className="relative w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white overflow-hidden">
                {logoPreview ? (
                  <Image src={logoPreview} alt="School Logo" width={140} height={140} className="object-cover rounded-full" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200"></div>
                )}
                <Button
                  type="button"
                  size="icon"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </Button>
              </div>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setLogoPreview, 'logoUrl')}
                className="hidden"
              />
            </div>

            {/* Form Center */}
            <div className="flex-1">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-blue-600">School Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* School Name */}
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter school name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* School Type */}
                    <FormField
                      control={form.control}
                      name="schoolType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>School Type</FormLabel>
                          <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                              <RadioGroupItem value="single" /> Single
                              <RadioGroupItem value="multiBranch" /> Multi Branch
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Phone */}
                    <FormField
                      control={form.control}
                      name="phoneNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone No</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Alt Phone */}
                    <FormField
                      control={form.control}
                      name="altPhoneNo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Alt Phone No</FormLabel>
                          <FormControl>
                            <Input placeholder="Alternate phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Address */}
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* City */}
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter city" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* State */}
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter state" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Pin Code */}
                    <FormField
                      control={form.control}
                      name="pinCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pin Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter pin code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Point of Contact */}
                    <FormField
                      control={form.control}
                      name="schoolPointOfContact"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Point of Contact</FormLabel>
                          <FormControl>
                            <Input placeholder="Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="pointOfContactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="Phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Verified */}
                    <FormField
                      control={form.control}
                      name="verified"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Verified</FormLabel>
                          <FormControl>
                            <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="true">Verified</SelectItem>
                                <SelectItem value="false">Unverified</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-4 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setLogoPreview('');
                    setIdCardPreview('');
                  }}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>
            </div>

            {/* Live ID Card Preview Right */}
            <div className="flex-shrink-0 w-72">
              <CardContent>
                <h3 className="text-sm font-semibold text-gray-800 mb-4 text-center">Live ID Card Preview</h3>
                <div className="w-56 h-80 p-3 rounded-3xl bg-white shadow-md border border-gray-100 mx-auto">
                  {/* Place live preview content */}
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-14 h-14 rounded-full bg-gray-200 mb-3">
                      {idCardPreview && <Image src={idCardPreview} alt="Student" width={56} height={56} className="rounded-full object-cover" />}
                    </div>
                    <div className="text-xs text-gray-600">Student Preview</div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-3 w-full"
                  onClick={() => idCardInputRef.current?.click()}
                >
                  Choose File
                </Button>
                <input
                  ref={idCardInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, setIdCardPreview, 'idCardDesignUrl')}
                  className="hidden"
                />
              </CardContent>
            </div>
          </form>
        </Form>
      </div>

      <IdCardPreviewModal
        isOpen={showModal}
        onClose={handleModalClose}
        schoolData={{
          schoolName: form.getValues('schoolName'),
          logoUrl: logoPreview,
          idCardDesignUrl: idCardPreview,
        }}
      />
    </>
  );
}
