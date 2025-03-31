import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Edit, Trash } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import type { 
  Hub as SchemaHub, 
  Event as SchemaEvent, 
  HubEventRegistration as SchemaWaitlistEntry 
} from "@shared/schema";

// Definition of columns for events table
export const eventColumns: ColumnDef<SchemaEvent>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-left px-0 hover:bg-transparent"
        >
          Event Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.original.title}</div>,
  },
  {
    accessorKey: "eventType",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{row.original.eventType}</div>,
  },
  {
    accessorKey: "startDate",
    header: "Date",
    cell: ({ row }) => (
      <div>{new Date(row.original.startDate).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (
      <div className={row.original.isPublished ? "text-green-600" : "text-amber-600"}>
        {row.original.isPublished ? "Published" : "Draft"}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const event = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Definition of columns for hubs table
export const hubColumns: ColumnDef<SchemaHub>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-left px-0 hover:bg-transparent"
        >
          Hub Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="truncate max-w-[200px]">{row.original.description || "N/A"}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const hub = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
              <Trash className="h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// Definition of columns for waitlist entries table
export const waitlistColumns: ColumnDef<SchemaWaitlistEntry>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-medium text-left px-0 hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "First Name",
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
  },
  {
    accessorKey: "interestAreas",
    header: "Interests",
    cell: ({ row }) => {
      const interests = row.original.interestAreas as string[];
      return <div>{interests.join(", ")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const entry = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Edit className="h-4 w-4" />
              <span>Send Invite</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];