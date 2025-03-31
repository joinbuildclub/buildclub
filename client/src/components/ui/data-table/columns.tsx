import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Edit, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  Hub as SchemaHub,
  Event as SchemaEvent,
  Registration as SchemaRegistration,
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
    cell: ({ row }) => (
      <div className="capitalize">{row.original.eventType}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Date",
    cell: ({ row }) => {
      const startDate = row.original.startDate;
      return (
        <div>
          {startDate
            ? new Date(startDate as string).toLocaleDateString()
            : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "isPublished",
    header: "Status",
    cell: ({ row }) => (
      <div
        className={
          row.original.isPublished ? "text-green-600" : "text-amber-600"
        }
      >
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
      <div className="truncate max-w-[200px]">
        {row.original.description || "N/A"}
      </div>
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

// Definition of columns for enriched event registrations table
export const registrationColumns: ColumnDef<any>[] = [
  {
    accessorKey: "registration.email",
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
    cell: ({ row }) => <div>{row.original.registration.email}</div>,
  },
  {
    accessorKey: "registration.firstName",
    header: "First Name",
    cell: ({ row }) => <div>{row.original.registration.firstName}</div>,
  },
  {
    accessorKey: "registration.lastName",
    header: "Last Name",
    cell: ({ row }) => <div>{row.original.registration.lastName}</div>,
  },
  {
    accessorKey: "event.title",
    header: "Event",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.event.title}</div>
    ),
  },
  {
    accessorKey: "hub.name",
    header: "Hub",
    cell: ({ row }) => <div>{row.original.hub.name}</div>,
  },
  {
    accessorKey: "registration.status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.registration.status;
      let statusClasses = "px-2 py-1 rounded text-xs font-medium max-w-fit";

      switch (status) {
        case "registered":
          statusClasses += " bg-amber-100 text-amber-800";
          break;
        case "confirmed":
          statusClasses += " bg-blue-100 text-blue-800";
          break;
        case "attended":
          statusClasses += " bg-green-100 text-green-800";
          break;
        case "cancelled":
          statusClasses += " bg-red-100 text-red-800";
          break;
        default:
          statusClasses += " bg-gray-100 text-gray-800";
      }

      return (
        <div className={statusClasses}>
          {status
            ? status.charAt(0).toUpperCase() + status.slice(1)
            : "Registered"}
        </div>
      );
    },
  },
  {
    accessorKey: "registration.createdAt",
    header: "Registration Date",
    cell: ({ row }) => {
      const date = row.original.registration.createdAt;
      return <div>{date ? new Date(date).toLocaleDateString() : "N/A"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const registration = row.original.registration;
      const event = row.original.event;

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
              <span>Update Status</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600">
              <Trash className="h-4 w-4" />
              <span>Cancel Registration</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
