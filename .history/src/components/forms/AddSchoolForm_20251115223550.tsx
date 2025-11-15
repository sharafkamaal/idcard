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
import { Label } from '@/components/ui/label';
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
    
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">School Profile</CardTitle>
            </CardHeader>

            <CardContent>
              {/* Grid: left = logo, middle = fields, right = preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
                {/* --------------- Left: Logo --------------- */}
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white overflow-hidden">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="School Logo"
                        width={140}
                        height={140}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        <div className="w-20 h-20 rounded-full bg-gray-200" />
                      </div>
                    )}

                    <Button
                      type="button"
                      size="icon"
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-lg"
                      aria-label="Edit school logo"
                      title="Edit school logo"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </Button>
                  </div>

                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setLogoPreview, 'logoUrl')}
                    className="hidden"
                    aria-label="Upload school logo"
                  />

                  <p className="text-xs text-gray-500 mt-3">Logo Size</p>
                  <p className="text-xs text-gray-400">(W:200px × H:200px)</p>
                </div>

                {/* --------------- Middle: Form Fields --------------- */}
                <div className="lg:col-span-1 lg:col-start-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto">
                    {/* School Name */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">
                        School Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter school name"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* School Type */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">
                        School Type <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="schoolType"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-6">
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="single" />
                                  </FormControl>
                                  <FormLabel className="text-base font-normal">Single</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-2">
                                  <FormControl>
                                    <RadioGroupItem value="multiBranch" />
                                  </FormControl>
                                  <FormLabel className="text-base font-normal">Multi Branch</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone No */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">
                        Phone No <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="phoneNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter phone number"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Alt Phone */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">Alt - Phone No</FormLabel>
                      <FormField
                        control={form.control}
                        name="altPhoneNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter alternate phone number"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address */}
                    <div className="flex flex-col md:col-span-2 lg:col-span-1">
                      <FormLabel className="mb-2 text-sm text-gray-700">
                        Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter address"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* City */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">
                        City <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter city"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* State */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">
                        State <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter state"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Pin Code */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">
                        Pin Code <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="pinCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Enter pin code"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* School Point of Contact */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">School Point of Contact</FormLabel>
                      <FormField
                        control={form.control}
                        name="schoolPointOfContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Name"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Point of Contact Phone */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">Point of Contact Phone No</FormLabel>
                      <FormField
                        control={form.control}
                        name="pointOfContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Phone number"
                                {...field}
                                className="w-full px-4 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-400 text-base"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Verification */}
                    <div className="flex flex-col">
                      <FormLabel className="mb-2 text-sm text-gray-700">
                        Verification Status <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormField
                        control={form.control}
                        name="verified"
                        render={({ field }) => (
                          <FormItem>
                            <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                              <FormControl>
                                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded text-base">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="true">Verified</SelectItem>
                                <SelectItem value="false">Unverified</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* --------------- Right: Live ID Card Preview --------------- */}
                <div className="flex justify-center lg:justify-start">
                  <div className="flex flex-col items-center w-full max-w-64">
                    <h3 className="text-sm font-semibold text-gray-800 mb-4">Live ID Card Preview</h3>
                    <div className="w-56 h-80 p-3 rounded-3xl bg-white shadow-sm border border-gray-100 flex-shrink-0">
                      <div className="relative w-full h-full rounded-3xl bg-white overflow-hidden">
                        <div className="absolute inset-y-0 -left-14 w-40 bg-gradient-to-b from-green-500 via-green-400 to-emerald-300 opacity-80 -skew-x-6" />
                        <div className="absolute inset-y-0 -right-14 w-40 bg-gradient-to-b from-purple-700 via-purple-500 to-purple-400 opacity-80 skew-x-6" />
                        <div className="relative z-10 flex flex-col items-center h-full px-5 pt-6 pb-5 gap-4">
                          <div className="w-[72px] h-[72px] rounded-full border-[5px] border-green-500 bg-white flex items-center justify-center shadow-md">
                            {logoPreview ? (
                              <Image src={logoPreview} alt="School Logo" width={68} height={68} className="rounded-full object-cover" />
                            ) : (
                              <div className="w-14 h-14 rounded-full bg-gray-200" />
                            )}
                          </div>

                          <div className="text-center w-full">
                            <div className="text-sm font-bold text-gray-900 uppercase tracking-wide leading-tight">
                              {schoolName || 'School Name'}
                            </div>
                            <div className="mt-1 h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-purple-500" />
                          </div>

                          <div className="w-28 h-28 rounded-lg border-[5px] border-purple-500 bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                            {idCardPreview ? (
                              <Image src={idCardPreview} alt="Student" width={96} height={96} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-20 h-20 bg-gray-200" />
                            )}
                          </div>

                          <div className="w-full space-y-3 text-left">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Student Name</span>
                              <span className="text-xs font-semibold text-gray-900">STUDENT NAME</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Roll Number</span>
                              <span className="text-xs font-semibold text-gray-900">MPS-M-001</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Father's Name</span>
                              <span className="text-xs font-semibold text-gray-900">ARMAN AMAN</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3 text-center">Upload a student photo to preview inside the card</p>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => idCardInputRef.current?.click()}
                      className="mt-3"
                    >
                      Choose file
                    </Button>

                    <input
                      ref={idCardInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setIdCardPreview, 'idCardDesignUrl')}
                      className="hidden"
                      aria-label="Upload student photo"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ---------- Permissions Card ---------- */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="selectLayoutOfIdCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Layout of ID Card <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <FormItem className="flex items-center gap-2 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="vertical_id" />
                            </FormControl>
                            <FormLabel className="font-normal">Vertical id</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="horizontal_id" />
                            </FormControl>
                            <FormLabel className="font-normal">Horizontal id</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sessionDisplayOnCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Session Display on ID Card</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'true')}
                          defaultValue={String(field.value)}
                          className="space-y-2"
                        >
                          <FormItem className="flex items-center gap-2 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="pdfDownloadAccess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PDF Download Access</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'true')}
                          defaultValue={String(field.value)}
                          className="space-y-2"
                        >
                          <FormItem className="flex items-center gap-2 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="true" />
                            </FormControl>
                            <FormLabel className="font-normal">Enable</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="false" />
                            </FormControl>
                            <FormLabel className="font-normal">Disable</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idCardsNoType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Cards No type <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <FormItem className="flex items-center gap-2 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="Roll No" />
                            </FormControl>
                            <FormLabel className="font-normal">Roll No</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2 cursor-pointer">
                            <FormControl>
                              <RadioGroupItem value="Admission No" />
                            </FormControl>
                            <FormLabel className="font-normal">Admission No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-6">
                <FormField
                  control={form.control}
                  name="session"
                  render={({ field }) => (
                    <FormItem className="w-64">
                      <FormLabel>Session</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Session" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2023-2024">2023-2024</SelectItem>
                          <SelectItem value="2024-2025">2024-2025</SelectItem>
                          <SelectItem value="2025-2026">2025-2026</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* ---------- Form Actions ---------- */}
          <div className="flex justify-end gap-4">
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
        </form>
      </Form>

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
;
}
