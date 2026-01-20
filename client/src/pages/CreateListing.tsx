import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertListingSchema } from "@shared/routes";
import { useCreateListing } from "@/hooks/use-listings";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, MapPin } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";
import { z } from "zod";

// Enhance schema for form validation
const formSchema = insertListingSchema.extend({
  price: z.coerce.number().min(0),
  quantity: z.coerce.number().min(0),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateListing() {
  const [, setLocation] = useLocation();
  const createMutation = useCreateListing();
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "Plastic",
      unit: "kg",
      location: { lat: 51.505, lng: -0.09, address: "London, UK" }, // Default mock location
      images: [],
      status: "available"
    }
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages(prev => [...prev, reader.result as string]);
        form.setValue("images", [...images, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, [images, form]);

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const onSubmit = (data: FormValues) => {
    // Override images with state if needed, but react-hook-form handles it
    const submissionData = {
      ...data,
      images: images.length > 0 ? images : ["https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80"]
    };
    
    createMutation.mutate(submissionData, {
      onSuccess: () => setLocation("/dashboard")
    });
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Create Listing</h1>
        <p className="text-muted-foreground mt-1">Post your waste materials for sale</p>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g., Recycled PET Bottles" {...form.register("title")} />
            {form.formState.errors.title && <p className="text-destructive text-sm">{form.formState.errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select 
                id="category" 
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...form.register("category")}
              >
                {["Plastic", "Glass", "Metal", "Paper", "Electronics", "Textile"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <div className="flex gap-2">
                <Input type="number" id="quantity" {...form.register("quantity")} />
                <select 
                  className="w-24 rounded-xl border border-input bg-background px-3 text-sm focus-visible:ring-2 focus-visible:ring-ring"
                  {...form.register("unit")}
                >
                  <option value="kg">kg</option>
                  <option value="tons">tons</option>
                  <option value="units">units</option>
                </select>
              </div>
              {form.formState.errors.quantity && <p className="text-destructive text-sm">{form.formState.errors.quantity.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
             <Label htmlFor="price">Price (USD)</Label>
             <Input type="number" id="price" {...form.register("price")} />
             {form.formState.errors.price && <p className="text-destructive text-sm">{form.formState.errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe the condition and source of the waste..." 
              className="min-h-[120px]"
              {...form.register("description")} 
            />
            {form.formState.errors.description && <p className="text-destructive text-sm">{form.formState.errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <div {...getRootProps()} className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-secondary/30 transition-colors">
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag & drop images here, or click to select</p>
            </div>
            {images.length > 0 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="Preview" className="h-20 w-20 object-cover rounded-lg border border-border" />
                ))}
              </div>
            )}
          </div>

          {/* Location Mock */}
          <div className="p-4 bg-muted/30 rounded-xl flex items-center gap-3 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-primary" />
            <span>Using default location: London, UK (Mock functionality)</span>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={createMutation.isPending}>
              {createMutation.isPending ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Creating...</>
              ) : (
                "Publish Listing"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
