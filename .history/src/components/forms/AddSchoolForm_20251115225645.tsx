'use client';

import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Download, Plus, Trash2 } from 'lucide-react';

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

interface Branch {
  id: string;
  branchName: string;
  branchAddress: string;
  branchCity: string;
  branchPhone: string;
}

export function AddSchoolForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState('');
  const [idCardPreview, setIdCardPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [pdfEnabled, setPdfEnabled] = useState(true);

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
  const schoolType = form.watch('schoolType');
  const pdfDownloadAccess = form.watch('pdfDownloadAccess');

  // Add new branch
  const addBranch = () => {
    const newBranch: Branch = {
      id: Date.now().toString(),
      branchName: '',
      branchAddress: '',
      branchCity: '',
      branchPhone: '',
    };
    setBranches([...branches, newBranch]);
  };

  // Remove branch
  const removeBranch = (id: string) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  // Update branch data
  const updateBranch = (id: string, field: keyof Branch, value: string) => {
    setBranches(branches.map(branch => 
      branch.id === id ? { ...branch, [field]: value } : branch
    ));
  };

  // Handle PDF Download
  const handlePdfDownload = async () => {
    if (!pdfDownloadAccess) {
      toast({
        title: 'Access Denied',
        description: 'PDF download is currently disabled',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Get form data
      const formValues = form.getValues();
      
      // Create PDF content
      const pdfContent = `
School Profile Report
=====================

School Name: ${formValues.schoolName}
School Type: ${formValues.schoolType}
Phone: ${formValues.phoneNo}
Alt Phone: ${formValues.altPhoneNo || 'N/A'}
Address: ${formValues.address}
City: ${formValues.city}
State: ${formValues.state}
Pin Code: ${formValues.pinCode}

Contact Information:
Point of Contact: ${formValues.schoolPointOfContact || 'N/A'}
Contact Phone: ${formValues.pointOfContactPhone || 'N/A'}

ID Card Settings:
Layout: ${formValues.selectLayoutOfIdCard}
Session Display: ${formValues.sessionDisplayOnCard ? 'Yes' : 'No'}
ID Type: ${formValues.idCardsNoType}
Session: ${formValues.session || 'Not selected'}

${schoolType === 'multiBranch' && branches.length > 0 ? `
Branches (${branches.length}):
${branches.map((branch, index) => `
  Branch ${index + 1}:
  Name: ${branch.branchName}
  Address: ${branch.branchAddress}
  City: ${branch.branchCity}
  Phone: ${branch.branchPhone}
`).join('\n')}
` : ''}

Generated on: ${new Date().toLocaleString()}
      `;

      // Create blob and download
      const blob = new Blob([pdfContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `school-profile-${formValues.schoolName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'School profile downloaded successfully',
      });
    } catch (error) {
      console.error('PDF download error:', error);
      toast({
        title: 'Error',
        description: 'Failed to download PDF',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

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
      // Add branches data if multi-branch
      const submitData = {
        ...data,
        branches: schoolType === 'multiBranch' ? branches : [],
      };

      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
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
    setBranches([]);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-blue-600">School Profile</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePdfDownload}
                disabled={loading || !pdfDownloadAccess}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Download PDF</span>
              </Button>
            </CardHeader>

            <CardContent>
              {/* Responsive 3-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* LEFT: Logo Upload */}
                <div className="lg:col-span-2 flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white overflow-hidden shadow-md">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="School Logo"
                        width={140}
                        height={140}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-50">
                        <div className="w-20 h-20 rounded-full bg-gray-200" />
                      </div>
                    )}

                    <Button
                      type="button"
                      size="icon"
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-lg"
                      aria-label="Edit school logo"
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

                  <p className="text-xs text-gray-500 mt-3 text-center">Logo Size</p>
                  <p className="text-xs text-gray-400 text-center">(200px × 200px)</p>
                </div>

                {/* CENTER: Form Fields */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* School Name */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter school name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* School Type */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="schoolType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Type <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <RadioGroup 
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  if (value === 'single') {
                                    setBranches([]);
                                  }
                                }} 
                                defaultValue={field.value} 
                                className="flex gap-4"
                              >
                                <FormItem className="flex items-center gap-2">
                                  <FormControl><RadioGroupItem value="single" /></FormControl>
                                  <FormLabel className="font-normal cursor-pointer">Single</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-2">
                                  <FormControl><RadioGroupItem value="multiBranch" /></FormControl>
                                  <FormLabel className="font-normal cursor-pointer">Multi Branch</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone No */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="phoneNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone No <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Alt Phone */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="altPhoneNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alt Phone No</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter alternate phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2 sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Pin Code */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="pinCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pin Code <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter pin code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* School Point of Contact */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="schoolPointOfContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Point of Contact</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Point of Contact Phone */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="pointOfContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone No</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Verification */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="verified"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Status <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                              <FormControl>
                                <SelectTrigger>
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

                {/* RIGHT: ID Card Preview */}
                <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Live ID Card Preview</h3>
                  
                  <div className="w-56 h-80 p-3 rounded-3xl bg-white shadow-lg border border-gray-200">
                    <div className="relative w-full h-full rounded-3xl bg-white overflow-hidden">
                      <div className="absolute inset-y-0 -left-14 w-40 bg-gradient-to-b from-green-500 via-green-400 to-emerald-300 opacity-80 -skew-x-6" />
                      <div className="absolute inset-y-0 -right-14 w-40 bg-gradient-to-b from-purple-700 via-purple-500 to-purple-400 opacity-80 skew-x-6" />
                      
                      <div className="relative z-10 flex flex-col items-center h-full px-5 pt-6 pb-5 gap-4">
                        <div className="w-[72px] h-[72px] rounded-full border-[5px] border-green-500 bg-white flex items-center justify-center shadow-md">
                          {logoPreview ? (
                            <Image src={logoPreview} alt="Logo" width={68} height={68} className="rounded-full object-cover" />
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

                        <div className="w-full space-y-2 text-left">
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
                            <span className="text-xs font-semibold text-gray-900">FATHER NAME</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 text-center">Upload student photo</p>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => idCardInputRef.current?.click()}
                    className="mt-2 w-full"
                    size="sm"
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
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Multi-Branch Section - Dynamically Shows/Hides */}
          {schoolType === 'multiBranch' && (
            <Card className="border-2 border-blue-200 bg-blue-50/30">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-blue-600">Branch Information</CardTitle>
                <Button
                  type="button"
                  onClick={addBranch}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Branch
                </Button>
              </CardHeader>
              <CardContent>
                {branches.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No branches added yet. Click "Add Branch" to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {branches.map((branch, index) => (
                      <div key={branch.id} className="relative p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold text-gray-700">Branch {index + 1}</h4>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeBranch(branch.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Branch Name <span className="text-red-500">*</span></Label>
                            <Input
                              placeholder="Branch name"
                              value={branch.branchName}
                              onChange={(e) => updateBranch(branch.id, 'branchName', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Branch Phone</Label>
                            <Input
                              placeholder="Phone number"
                              value={branch.branchPhone}
                              onChange={(e) => updateBranch(branch.id, 'branchPhone', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2 sm:col-span-2">
                            <Label>Branch Address</Label>
                            <Input
                              placeholder="Address"
                              value={branch.branchAddress}
                              onChange={(e) => updateBranch(branch.id, 'branchAddress', e.target.value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>City</Label>
                            <Input
                              placeholder="City"
                              value={branch.branchCity}
                              onChange={(e) => updateBranch(branch.id, 'branchCity', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Permissions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <FormField
                  control={form.control}
                  name="selectLayoutOfIdCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Card Layout <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="vertical_id" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Vertical</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="horizontal_id" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Horizontal</FormLabel>
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
                      <FormLabel>Session Display</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)} className="space-y-2">
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="true" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="false" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">No</FormLabel>
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
                      <FormLabel>PDF Download</FormLabel>
                      <FormControl>
                        <RadioGroup 
                          onValueChange={(value) => {
                            const boolValue = value === 'true';
                            field.onChange(boolValue);
                            setPdfEnabled(boolValue);
                          }} 
                          defaultValue={String(field.value)} 
                          className="space-y-2"
                        >
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="true" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Enable</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="false" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Disable</FormLabel>
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
                      <FormLabel>ID Number Type <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="Roll No" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Roll No</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="Admission No" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Admission No</FormLabel>
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
                    <FormItem className="max-w-xs">
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

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setLogoPreview('');
                setIdCardPreview('');
                setBranches([]);
              }}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
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
}'use client';

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
  };

  const handleModalClose = () => {
    setShowModal(false);
    form.reset();
    setLogoPreview('');
    setIdCardPreview('');
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">School Profile</CardTitle>
            </CardHeader>

            <CardContent>
              {/* Responsive 3-Column Layout: Logo | Form Fields | ID Card Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                
                {/* LEFT COLUMN: Logo Upload (2 cols on lg) */}
                <div className="lg:col-span-2 flex flex-col items-center">
                  <div className="relative w-40 h-40 rounded-full border-4 border-gray-200 flex items-center justify-center bg-white overflow-hidden shadow-md">
                    {logoPreview ? (
                      <Image
                        src={logoPreview}
                        alt="School Logo"
                        width={140}
                        height={140}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gray-50">
                        <div className="w-20 h-20 rounded-full bg-gray-200" />
                      </div>
                    )}

                    <Button
                      type="button"
                      size="icon"
                      onClick={() => logoInputRef.current?.click()}
                      className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 shadow-lg"
                      aria-label="Edit school logo"
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

                  <p className="text-xs text-gray-500 mt-3 text-center">Logo Size</p>
                  <p className="text-xs text-gray-400 text-center">(200px × 200px)</p>
                </div>

                {/* MIDDLE COLUMN: Form Fields (7 cols on lg) */}
                <div className="lg:col-span-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* School Name */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="schoolName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter school name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* School Type */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="schoolType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Type <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                                <FormItem className="flex items-center gap-2">
                                  <FormControl><RadioGroupItem value="single" /></FormControl>
                                  <FormLabel className="font-normal cursor-pointer">Single</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center gap-2">
                                  <FormControl><RadioGroupItem value="multiBranch" /></FormControl>
                                  <FormLabel className="font-normal cursor-pointer">Multi Branch</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Phone No */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="phoneNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone No <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Alt Phone */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="altPhoneNo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alt Phone No</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter alternate phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Address */}
                    <div className="space-y-2 sm:col-span-2">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* State */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>State <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter state" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Pin Code */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="pinCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pin Code <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Enter pin code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* School Point of Contact */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="schoolPointOfContact"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>School Point of Contact</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Point of Contact Phone */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="pointOfContactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Phone No</FormLabel>
                            <FormControl>
                              <Input placeholder="Contact phone" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Verification */}
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="verified"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Verification Status <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)}>
                              <FormControl>
                                <SelectTrigger>
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

                {/* RIGHT COLUMN: ID Card Preview (3 cols on lg) */}
                <div className="lg:col-span-3 flex flex-col items-center lg:items-start">
                  <h3 className="text-sm font-semibold text-gray-800 mb-4">Live ID Card Preview</h3>
                  
                  <div className="w-56 h-80 p-3 rounded-3xl bg-white shadow-lg border border-gray-200">
                    <div className="relative w-full h-full rounded-3xl bg-white overflow-hidden">
                      <div className="absolute inset-y-0 -left-14 w-40 bg-gradient-to-b from-green-500 via-green-400 to-emerald-300 opacity-80 -skew-x-6" />
                      <div className="absolute inset-y-0 -right-14 w-40 bg-gradient-to-b from-purple-700 via-purple-500 to-purple-400 opacity-80 skew-x-6" />
                      
                      <div className="relative z-10 flex flex-col items-center h-full px-5 pt-6 pb-5 gap-4">
                        {/* School Logo */}
                        <div className="w-[72px] h-[72px] rounded-full border-[5px] border-green-500 bg-white flex items-center justify-center shadow-md">
                          {logoPreview ? (
                            <Image src={logoPreview} alt="Logo" width={68} height={68} className="rounded-full object-cover" />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gray-200" />
                          )}
                        </div>

                        {/* School Name */}
                        <div className="text-center w-full">
                          <div className="text-sm font-bold text-gray-900 uppercase tracking-wide leading-tight">
                            {schoolName || 'School Name'}
                          </div>
                          <div className="mt-1 h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-green-500 via-emerald-400 to-purple-500" />
                        </div>

                        {/* Student Photo */}
                        <div className="w-28 h-28 rounded-lg border-[5px] border-purple-500 bg-gray-100 flex items-center justify-center shadow-sm overflow-hidden">
                          {idCardPreview ? (
                            <Image src={idCardPreview} alt="Student" width={96} height={96} className="object-cover w-full h-full" />
                          ) : (
                            <div className="w-20 h-20 bg-gray-200" />
                          )}
                        </div>

                        {/* Student Details */}
                        <div className="w-full space-y-2 text-left">
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
                            <span className="text-xs font-semibold text-gray-900">FATHER NAME</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 mt-3 text-center">Upload student photo</p>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => idCardInputRef.current?.click()}
                    className="mt-2 w-full"
                    size="sm"
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
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-blue-600">Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <FormField
                  control={form.control}
                  name="selectLayoutOfIdCard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID Card Layout <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="vertical_id" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Vertical</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="horizontal_id" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Horizontal</FormLabel>
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
                      <FormLabel>Session Display</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)} className="space-y-2">
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="true" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="false" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">No</FormLabel>
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
                      <FormLabel>PDF Download</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={(value) => field.onChange(value === 'true')} defaultValue={String(field.value)} className="space-y-2">
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="true" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Enable</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="false" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Disable</FormLabel>
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
                      <FormLabel>ID Number Type <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="Roll No" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Roll No</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center gap-2">
                            <FormControl><RadioGroupItem value="Admission No" /></FormControl>
                            <FormLabel className="font-normal cursor-pointer">Admission No</FormLabel>
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
                    <FormItem className="max-w-xs">
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

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                form.reset();
                setLogoPreview('');
                setIdCardPreview('');
              }}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              Reset
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
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