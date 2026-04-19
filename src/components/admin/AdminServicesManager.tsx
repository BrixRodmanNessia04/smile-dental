"use client";

import { useActionState, useMemo, useState } from "react";

import {
  createServiceAction,
  INITIAL_SERVICE_FORM_STATE,
  toggleServiceActiveAction,
  updateServiceAction,
} from "@/features/appointments/actions/manageService";
import type { AdminServiceItem } from "@/features/appointments/types";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import Textarea from "@/components/ui/textarea";

type AdminServicesManagerProps = {
  services: AdminServiceItem[];
};

type ServiceFilter = "all" | "active" | "inactive";

function formatMoney(value: number | null) {
  if (value === null) {
    return "-";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function ServiceFormFields({
  service,
  errors,
}: {
  service?: AdminServiceItem;
  errors?: {
    name?: string[];
    durationMinutes?: string[];
    basePrice?: string[];
    description?: string[];
  };
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor={service ? "edit-name" : "create-name"}>Service name</Label>
        <Input
          defaultValue={service?.name ?? ""}
          id={service ? "edit-name" : "create-name"}
          name="name"
          placeholder="Comprehensive oral exam"
          required
        />
        {errors?.name?.[0] ? <p className="text-sm text-destructive">{errors.name[0]}</p> : null}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor={service ? "edit-duration" : "create-duration"}>Duration (minutes)</Label>
          <Input
            defaultValue={service?.durationMinutes ?? 30}
            id={service ? "edit-duration" : "create-duration"}
            min={5}
            name="durationMinutes"
            required
            type="number"
          />
          {errors?.durationMinutes?.[0] ? (
            <p className="text-sm text-destructive">{errors.durationMinutes[0]}</p>
          ) : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor={service ? "edit-price" : "create-price"}>Base price (optional)</Label>
          <Input
            defaultValue={service?.basePrice ?? ""}
            id={service ? "edit-price" : "create-price"}
            min={0}
            name="basePrice"
            placeholder="95"
            step="0.01"
            type="number"
          />
          {errors?.basePrice?.[0] ? (
            <p className="text-sm text-destructive">{errors.basePrice[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor={service ? "edit-description" : "create-description"}>Description (optional)</Label>
        <Textarea
          defaultValue={service?.description ?? ""}
          id={service ? "edit-description" : "create-description"}
          name="description"
          placeholder="Short explanation shown across public booking pages."
          rows={4}
        />
        {errors?.description?.[0] ? (
          <p className="text-sm text-destructive">{errors.description[0]}</p>
        ) : null}
      </div>
    </div>
  );
}

function ServiceRows({ services }: { services: AdminServiceItem[] }) {
  if (services.length === 0) {
    return (
      <TableRow>
        <TableCell className="py-8 text-center text-sm text-muted-foreground" colSpan={6}>
          No services found for this filter.
        </TableCell>
      </TableRow>
    );
  }

  return (
    <>
      {services.map((service) => (
        <TableRow key={service.id}>
          <TableCell className="min-w-[220px]">
            <p className="font-semibold text-foreground">{service.name}</p>
            <p className="mt-1 break-all text-xs text-muted-foreground">/{service.slug}</p>
          </TableCell>
          <TableCell className="whitespace-nowrap text-muted-foreground">
            {service.durationMinutes} min
          </TableCell>
          <TableCell className="whitespace-nowrap text-muted-foreground">
            {formatMoney(service.basePrice)}
          </TableCell>
          <TableCell className="max-w-[280px]">
            <p className="break-words text-sm text-muted-foreground">
              {service.description ?? "No description"}
            </p>
          </TableCell>
          <TableCell className="whitespace-nowrap">
            <Badge variant={service.isActive ? "success" : "neutral"}>
              {service.isActive ? "Active" : "Inactive"}
            </Badge>
          </TableCell>
          <TableCell>
            <div className="flex flex-wrap justify-end gap-2">
              <EditServiceDialog service={service} />
              <form action={toggleServiceActiveAction}>
                <input name="serviceId" type="hidden" value={service.id} />
                <input
                  name="isActive"
                  type="hidden"
                  value={service.isActive ? "false" : "true"}
                />
                <Button size="sm" type="submit" variant="outline">
                  {service.isActive ? "Deactivate" : "Activate"}
                </Button>
              </form>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

function EditServiceDialog({ service }: { service: AdminServiceItem }) {
  const [state, formAction, isPending] = useActionState(
    updateServiceAction,
    INITIAL_SERVICE_FORM_STATE,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit service</DialogTitle>
          <DialogDescription>
            Update details used by both public pages and appointment booking.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="mt-4 space-y-4">
          <input name="serviceId" type="hidden" value={service.id} />
          <ServiceFormFields errors={state.errors} service={service} />

          {state.message ? (
            <p
              className={
                state.status === "success"
                  ? "text-sm text-success-strong"
                  : "text-sm text-destructive"
              }
            >
              {state.message}
            </p>
          ) : null}

          <DialogFooter>
            <Button disabled={isPending} type="submit" variant="accent">
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AdminServicesManager({ services }: AdminServicesManagerProps) {
  const [activeTab, setActiveTab] = useState<ServiceFilter>("all");
  const [createState, createAction, isCreatePending] = useActionState(
    createServiceAction,
    INITIAL_SERVICE_FORM_STATE,
  );

  const filteredServices = useMemo(() => {
    if (activeTab === "active") {
      return services.filter((service) => service.isActive);
    }

    if (activeTab === "inactive") {
      return services.filter((service) => !service.isActive);
    }

    return services;
  }, [activeTab, services]);

  const activeCount = services.filter((service) => service.isActive).length;

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <CardTitle>Services management</CardTitle>
          <CardDescription>
            Services are managed in admin and automatically reused by public pages and booking.
          </CardDescription>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="accent">Create service</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create service</DialogTitle>
              <DialogDescription>
                Add a new service for both public catalog and appointment form selection.
              </DialogDescription>
            </DialogHeader>

            <form action={createAction} className="mt-4 space-y-4">
              <ServiceFormFields errors={createState.errors} />

              {createState.message ? (
                <p
                  className={
                    createState.status === "success"
                      ? "text-sm text-success-strong"
                      : "text-sm text-destructive"
                  }
                >
                  {createState.message}
                </p>
              ) : null}

              <DialogFooter>
                <Button disabled={isCreatePending} type="submit" variant="accent">
                  {isCreatePending ? "Creating..." : "Create service"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {services.length} total services • {activeCount} active
          </p>
        </div>

        <Tabs onValueChange={(value) => setActiveTab(value as ServiceFilter)} value={activeTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Service</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <ServiceRows services={filteredServices} />
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
