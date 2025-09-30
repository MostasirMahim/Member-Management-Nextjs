"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { MailPlus, Plus, ALargeSmall, FilePlus2, SquareMinus, Captions } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import axiosInstance from "@/lib/axiosInstance";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface Props {
  configData: any;
  groupData: any;
}

export default function ComposeMailForm({ configData, groupData }: Props) {
  const configs = configData?.data;
  const groups = groupData?.data;

  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (content: string) => {
    setValue(content);
  };

  const handleSend = async () => {
    console.log(value);
  };
  const form = useForm({
    defaultValues: {
      mail_subject: "",
      mail_config_selector: "",
      attachment_input: "",
      group_selector: "",
      notes: "",
      "reset-button-0": "",
      "submit-button-0": "",
    },
  });

  async function onSubmit(values: any) {
    setLoading(true);

    if (value == "") {
      toast.error("Mail body is required", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("subject", values.mail_subject);
    formData.append("configurations", values.mail_config_selector);
    formData.append("body", value);

    if (values.attachment_input?.[0]) {
      formData.append("attachments", values.attachment_input[0]);
    }
    try {
      const response = await axiosInstance.post(
        "/api/mails/v1/email/composes/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        if (values.group_selector && values.group_selector !== "none") {
          const sendMailData = {
            group: values.group_selector,
            notes: values.notes,
            email_compose: response?.data?.data?.id,
          };

          const sendMailResponse = await axiosInstance.post(
            "/api/mails/v1/emails/send/",
            sendMailData
          );

          if (sendMailResponse.status === 201) {
            toast.success("Mail sent successfully", {
              position: "top-center",
              autoClose: 3000,
            });
            form.reset();
            form.clearErrors();
          } else {
            toast.warn("Mail composed but couldn't send to group!", {
              position: "top-center",
              autoClose: 3000,
            });
          }
        } else {
          toast.success("Mail compose created", {
            position: "top-center",
            autoClose: 3000,
          });
          form.reset();
          form.clearErrors();
        }
      } else {
        toast.error("Something went wrong", {
          position: "top-center",
          autoClose: 3000,
        });
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }

  function onReset() {
    form.reset();
    form.clearErrors();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        onReset={onReset}
        className="@container"
      >
        <div className="mx-auto max-w-6xl space-y-8 rounded-2xl  bg-card p-4 shadow-xl ring-1 ring-black/5">
          <FormField
            control={form.control}
            name="mail_subject"
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2.5 space-y-0 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                    <Captions
                      className="size-4 text-primary"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Subject
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Write a clear and concise subject line for your email
                    </p>
                  </div>
                </div>

                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Enter email subject"
                      type="text"
                      id="mail_subject"
                      className="h-12 border-border bg-background ps-11 text-base text-foreground shadow-sm ring-1 ring-black/5 placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
                      {...field}
                    />
                    <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-muted-foreground/70">
                      <ALargeSmall className="size-4" strokeWidth={2} />
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-xs font-medium" />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                <ALargeSmall
                  className="size-4 text-primary"
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Email Body
                </h3>
                <p className="text-xs text-muted-foreground">
                  Compose your message content
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm ring-1 ring-black/5 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
              <Textarea
                value={value}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Write your email content here..."
                className="min-h-[220px] resize-none border-0 bg-transparent px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-0 sm:min-h-[280px] sm:px-5 sm:py-4"
              />
            </div>
          </div>

          <div className="grid gap-6 sm:gap-7 md:grid-cols-2">
            <FormField
              control={form.control}
              name="mail_config_selector"
              rules={{ required: "Email configuration is required" }}
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 space-y-0">
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Mail Configuration{" "}
                    <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="py-2 border-border bg-background text-base text-foreground shadow-sm ring-1 ring-black/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select configuration" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-popover shadow-lg">
                        {configs.map((config: any) => (
                          <SelectItem
                            key={config.id}
                            value={`${config.id}`}
                            className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                          >
                            {config.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-xs leading-relaxed text-muted-foreground">
                    Choose the email account to send from
                  </FormDescription>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attachment_input"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 space-y-0">
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Attachments
                  </FormLabel>
                  <FormControl>
                    <div className="relative ">
                      <Input
                        type="file"
                        id="attachment_input"
                        className="cursor-pointer border-border bg-background ps-11 text-base text-foreground shadow-sm ring-1 ring-black/5 file:mr-4 file:cursor-pointer file:border-0 file:bg-transparent file:text-sm file:font-semibold file:text-foreground hover:bg-accent/30 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                        name={field.name}
                        ref={field.ref}
                      />
                      <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-4 text-muted-foreground/70">
                        <FilePlus2 className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs leading-relaxed text-muted-foreground">
                    Add files to your email (optional)
                  </FormDescription>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="group_selector"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 space-y-0">
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Recipient Group
                  </FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger className="border-border bg-background text-base text-foreground shadow-sm ring-1 ring-black/5 focus:border-primary/50 focus:ring-2 focus:ring-primary/20">
                        <SelectValue placeholder="Select a group" />
                      </SelectTrigger>
                      <SelectContent className="border-border bg-popover shadow-lg">
                        {groups.map((group: any) => (
                          <SelectItem
                            key={group.id}
                            value={`${group.id}`}
                            className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                          >
                            {group.name}
                          </SelectItem>
                        ))}
                        <SelectItem
                          key="none"
                          value="none"
                          className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
                        >
                          None (Save as draft)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-xs leading-relaxed text-muted-foreground">
                    Send to a group or save as draft
                  </FormDescription>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5 space-y-0 md:col-span-2">
                  <FormLabel className="text-sm font-semibold text-foreground">
                    Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="notes"
                      placeholder="Add notes about this email (optional)"
                      className="min-h-[110px] resize-none border-border bg-background text-base text-foreground shadow-sm ring-1 ring-black/5 placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/20"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs leading-relaxed text-muted-foreground">
                    Internal notes for tracking purposes
                  </FormDescription>
                  <FormMessage className="text-xs font-medium" />
                </FormItem>
              )}
            />
          </div>

          <div className="flex flex-col gap-3 border-t border-border/50 sm:flex-row sm:justify-end sm:gap-4">
            <FormField
              control={form.control}
              name="reset-button-0"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0 sm:flex-initial">
                  <FormControl>
                    <Button
                      id="reset-button-0"
                      className="w-full border-border bg-background text-base font-semibold text-foreground shadow-sm ring-1 ring-black/5 hover:bg-accent hover:text-accent-foreground sm:w-36"
                      type="reset"
                      variant="outline"
                    >
                      Reset
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="submit-button-0"
              render={({ field }) => (
                <FormItem className="flex-1 space-y-0 sm:flex-initial">
                  <FormControl>
                    <Button
                      id="submit-button-0"
                      className="w-full bg-primary text-base font-semibold text-primary-foreground shadow-md ring-1 ring-black/10 hover:bg-primary/90 hover:shadow-lg disabled:opacity-60 sm:w-44"
                      type="submit"
                      variant="default"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center gap-2.5">
                          <span className="size-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                          Sending...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2.5">
                          <MailPlus className="size-5" strokeWidth={2.5} />
                          Send Email
                        </span>
                      )}
                    </Button>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
