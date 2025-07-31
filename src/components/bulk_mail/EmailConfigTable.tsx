import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ban, Check, Send } from "lucide-react";
import { Button } from "../ui/button";

interface Props {
  data: any;
}
function EmailConfigTable({ data }: Props) {
  const emailConfigs = data?.data;

  return (
    <div className="p-4">
      <Table>
        <TableCaption>
          <div>
            <h4 className="flex items-center justify-center">
              <Send /> Email Configuration Settings
            </h4>
          </div>
        </TableCaption>
        <TableHeader>
          <TableRow className="bg-gray-200 dark:bg-gray-800">
            <TableHead className="text-center">ID</TableHead>
            <TableHead className="text-center">Is Active</TableHead>
            <TableHead className="text-center">Name</TableHead>
            <TableHead className="text-center">Provider</TableHead>
            <TableHead className="text-center">Host</TableHead>
            <TableHead className="text-center">Port</TableHead>
            <TableHead className="text-center">Username</TableHead>
            <TableHead className="text-center">Password</TableHead>
            <TableHead className="text-center">TLS</TableHead>
            <TableHead className="text-center">SSL</TableHead>
            <TableHead className="text-center">Aws access key id</TableHead>
            <TableHead className="text-center">Aws secret access key</TableHead>
            <TableHead className="text-center">Aws region</TableHead>
            <TableHead className="text-center">Ses configuration set</TableHead>
            <TableHead className="text-center">Iam role arn</TableHead>
            <TableHead className="text-center">Tracking</TableHead>
            <TableHead className="text-center">User</TableHead>
            <TableHead className="text-center">Created At</TableHead>
            <TableHead className="text-center">Updated At</TableHead>
            <TableHead className="text-center">Update</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emailConfigs.map((config: any, index: number) => (
            <TableRow key={index}>
              <TableCell className="text-center">{config.id}</TableCell>
              <TableCell className="text-center">
                {config.is_active ? (
                  <span className="text-green-700 font-semibold">
                    <Check />
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">
                    <Ban />
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.name || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.provider || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.host || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.port || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.username || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.password || "—"}
              </TableCell>
              <TableCell className="text-center">
                {config.use_tls ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-500 font-semibold">No</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {config.use_ssl ? (
                  <span className="text-green-600 font-semibold">Yes</span>
                ) : (
                  <span className="text-red-500 font-semibold">No</span>
                )}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.aws_access_key_id || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.aws_secret_access_key || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.aws_region || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.ses_configuration_set || "—"}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.iam_role_arn || "—"}
              </TableCell>
              <TableCell className="text-center">
                {config.enable_tracking ? (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    Enabled
                  </span>
                ) : (
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    Disabled
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center capitalize">
                {config.user || "—"}
              </TableCell>

              <TableCell className="text-center">
                {new Date(config.created_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell className="text-center">
                {new Date(config.updated_at).toLocaleString("en-BD", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </TableCell>
              <TableCell>
                <Button variant="default">Update</Button>
              </TableCell>
              <TableCell>
                <Button variant="destructive">Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default EmailConfigTable;
