import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { localToUTC } from "@/lib/dateUtils";

// Event form schema with Zod validation
const eventFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string({
    required_error: "Please specify a start time",
  }),
  endTime: z.string({
    required_error: "Please specify an end time",
  }),
  eventType: z.enum(["workshop", "meetup", "hackathon", "conference"], {
    required_error: "Please select an event type",
  }),
  focusAreas: z.array(z.enum(["product", "design", "engineering"]))
    .min(1, "Select at least one focus area"),
  isPublished: z.boolean().default(false),
  hubId: z.number({
    required_error: "Please select a hub",
  }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

// Define the props for the EventForm component
interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  onSubmit: (data: EventFormValues) => void;
  isEditing?: boolean;
  hubs: { id: number; name: string }[];
}

export default function EventForm({ 
  defaultValues, 
  onSubmit, 
  isEditing = false,
  hubs = [] 
}: EventFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    defaultValues?.date || undefined
  );

  // Initialize form with default values or empty values
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startTime: "18:30", // Default to 6:30 PM
      endTime: "21:30",   // Default to 9:30 PM
      eventType: "workshop",
      focusAreas: [],
      isPublished: false,
      hubId: 1, // Default to the first hub (Providence)
      ...defaultValues,
    },
  });

  // Handle form submission
  const handleSubmit = (values: EventFormValues) => {
    // Convert local date and times to UTC ISO strings before sending to server
    const startDateISO = localToUTC(
      format(values.date, "yyyy-MM-dd"),
      values.startTime
    );
    
    const endDateISO = localToUTC(
      format(values.date, "yyyy-MM-dd"),
      values.endTime
    );
    
    // Prepare the data to send to the server
    const eventData = {
      ...values,
      // Store as ISO strings in UTC format
      startDate: startDateISO,
      endDate: endDateISO,
    };
    
    // Call the onSubmit prop with the processed data
    onSubmit(eventData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event Title</FormLabel>
              <FormControl>
                <Input placeholder="AI Hackathon" {...field} />
              </FormControl>
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
                <Textarea 
                  placeholder="Learn all about AI agents and get hands-on with a practical workshop."
                  className="min-h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Event Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Time</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input 
                        type="time" 
                        {...field} 
                      />
                      <Clock className="ml-2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="endTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Time</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input 
                        type="time" 
                        {...field} 
                      />
                      <Clock className="ml-2 h-4 w-4 text-gray-400" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event Type</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="meetup">Meetup</SelectItem>
                    <SelectItem value="hackathon">Hackathon</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hubId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hub</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value, 10))} 
                  defaultValue={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select hub" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {hubs.map((hub) => (
                      <SelectItem key={hub.id} value={hub.id.toString()}>
                        {hub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="focusAreas"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel>Focus Areas</FormLabel>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="focusAreas"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key="product"
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes("product")}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, "product"])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== "product"
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Product
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="focusAreas"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key="design"
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes("design")}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, "design"])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== "design"
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Design
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="focusAreas"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key="engineering"
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes("engineering")}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, "engineering"])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== "engineering"
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Engineering
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublished"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Publish Event</FormLabel>
                <p className="text-muted-foreground text-sm">
                  When checked, this event will be visible on the public events page.
                </p>
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full md:w-auto">
          {isEditing ? "Update Event" : "Create Event"}
        </Button>
      </form>
    </Form>
  );
}