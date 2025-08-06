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
import { MailPlus, Plus, ALargeSmall, FilePlus2 } from "lucide-react";
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
import "react-quill/dist/quill.snow.css";
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
        className="space-y-8 @container"
      >
        <div className="w-full">
          <h4 className="text-2xl font-bold mb-2">Body</h4>
          <ReactQuill
            theme="snow"
            value={value}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="mail_subject"
            rules={{ required: "Subject is required" }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Subject</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        key="text-input-0"
                        placeholder="mail subject"
                        type="text"
                        id="mail_subject"
                        className=" ps-9"
                        {...field}
                      />
                      <div
                        className={
                          "text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center  peer-disabled:opacity-50 start-0 ps-3"
                        }
                      >
                        <ALargeSmall className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Write mail subject here.</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mail_config_selector"
            rules={{ required: "Email configuration is required" }}
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">
                  Mail configurations
                </FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-0"
                      id="mail_config_selector"
                      className=""
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Select a configuration" />
                      </SelectTrigger>
                      <SelectContent>
                        {configs.map((config: any) => (
                          <SelectItem key={config.id} value={`${config.id}`}>
                            {config.username}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select mail config so that mail can be sent using those.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="attachment_input"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Attachments</FormLabel>
                <div className="w-full">
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        type="file"
                        id="attachment_input"
                        className="ps-9"
                        onChange={(e) => {
                          field.onChange(e.target.files);
                        }}
                        name={field.name}
                        ref={field.ref}
                      />
                      <div className="text-muted-foreground pointer-events-none absolute inset-y-0 flex items-center justify-center peer-disabled:opacity-50 start-0 ps-3">
                        <FilePlus2 className="size-4" strokeWidth={2} />
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>Email attachment (If any)</FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="group_selector"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Group</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Select
                      key="select-1"
                      id="group_selector"
                      className=""
                      {...field}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="select a group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group: any) => (
                          <SelectItem key={group.id} value={`${group.id}`}>
                            {group.name}
                          </SelectItem>
                        ))}
                        <SelectItem key="none" value="none">
                          None
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Select a group if you want to send this composed email to
                    the group now.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="flex shrink-0">Notes</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Textarea
                      key="notes"
                      id="notes"
                      placeholder="eg: mail sending purpose"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    You can write notes if you are sending mail now and selected
                    a group
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reset-button-0"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Reset</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="reset-button-0"
                      id="reset-button-0"
                      name=""
                      className="w-full"
                      type="reset"
                      variant="outline"
                    >
                      Reset
                    </Button>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="submit-button-0"
            render={({ field }) => (
              <FormItem className="col-span-6 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                <FormLabel className="hidden shrink-0">Submit</FormLabel>

                <div className="w-full">
                  <FormControl>
                    <Button
                      key="submit-button-0"
                      id="submit-button-0"
                      name=""
                      className="w-full"
                      type="submit"
                      variant="default"
                      disabled={loading}
                    >
                      {loading ? "please wait..." : "submit"}
                    </Button>
                  </FormControl>

                  <FormMessage />
                </div>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
