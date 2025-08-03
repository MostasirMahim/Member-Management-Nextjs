"use client";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import axiosInstance from "@/lib/axiosInstance";
import { useRouter } from "next/navigation";
import { Bounce, toast } from "react-toastify";

export default function AddMailConfigForm() {
  const form = useForm<any>({});
  const { setError, reset } = form;
  const router = useRouter();
  async function onSubmit(values: any) {
    try {
      const response = await axiosInstance.post(
        "/api/mails/v1/configs/",
        values
      );
      const data = response.data;
      if (data.code == 201) {
        toast.success("Config added successfully", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        router.push("/emails/configurations/");
      } else {
        alert("Something went wrong");
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        // Field specific errors
        for (const key in errors) {
          if (key !== "non_field_errors") {
            setError(key, {
              type: "server",
              message: errors[key][0],
            });
          }
        }

        // Non-field errors (e.g. general form errors)
        if (errors.non_field_errors) {
          setError("root", {
            type: "server",
            message: errors.non_field_errors.join(" "),
          });
        }
        toast.error("Something went wrong!!", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
      } else {
        console.error("Form submission error", error);
      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 max-w-3xl mx-auto py-10"
      >
        {form.formState.errors.root && (
          <p className="text-sm text-red-500">
            {form.formState.errors.root.message}
          </p>
        )}
        <FormField
          control={form.control}
          name="name"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="jhon doue" type="" {...field} />
              </FormControl>
              <FormDescription>enter name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="provider"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Provider</FormLabel>
              <FormControl>
                <Input placeholder="eg: gmail, awa" type="" {...field} />
              </FormControl>
              <FormDescription>
                Enter mail service provider name
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="host"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Host</FormLabel>
              <FormControl>
                <Input placeholder="smtp.gmail.com" type="" {...field} />
              </FormControl>
              <FormDescription>Enter host name</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="port"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Port</FormLabel>
              <FormControl>
                <Input placeholder="587" type="text" {...field} />
              </FormControl>
              <FormDescription>Enter port</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="your-email@gmail.com"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter username</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="your-app-password" type="" {...field} />
              </FormControl>
              <FormDescription>Enter your-app-password</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="use_tls"
          render={({ field }: any) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Use TLS</FormLabel>
                <FormDescription>Do you want to use TLS</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="use_ssl"
          render={({ field }: any) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Use ssl</FormLabel>
                <FormDescription>Do you want to use SSL</FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aws_access_key_id"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Aws access key id</FormLabel>
              <FormControl>
                <Input placeholder="AKIAIOSFODNN7EXAMPLE" type="" {...field} />
              </FormControl>
              <FormDescription>Enter AWS access key id</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aws_secret_access_key"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Aws Secret Access key</FormLabel>
              <FormControl>
                <Input
                  placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                  type=""
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter aws secret access key</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aws_region"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Aws Region</FormLabel>
              <FormControl>
                <Input placeholder="us-east-1" type="" {...field} />
              </FormControl>
              <FormDescription>Enter AWS region </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ses_configuration_set"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Ses Configuration Set</FormLabel>
              <FormControl>
                <Input placeholder="default-config-set" type="" {...field} />
              </FormControl>
              <FormDescription>Enter SES config set</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="iam_role_arn"
          render={({ field }: any) => (
            <FormItem>
              <FormLabel>Iam Role Arn</FormLabel>
              <FormControl>
                <Input
                  placeholder="arn:aws:iam::123456789012:role/SESSendingAccessRole"
                  type=""
                  {...field}
                />
              </FormControl>
              <FormDescription>Enter IAM role ARN</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enable_tracking"
          render={({ field }: any) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Enable tracking</FormLabel>
                <FormDescription>
                  Do you want to enable tracking{" "}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  aria-readonly
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
