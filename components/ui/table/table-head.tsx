import {
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
} from "../primitives/table";

export default function TableHeadSection({ page }: { page: string }) {
  return (
    <>
      <TableHeader className="bg-stone-500/5">
        <TableRow className="font-neuemedium border-darkborder/30 hover:bg-white/[0.03]">
          <TableHead className="text-stone-700 dark:text-white/75">
            Index
          </TableHead>
          <TableHead className="text-stone-700 dark:text-white/75">
            Transaction Account
          </TableHead>
          <TableHead className="text-stone-700 dark:text-white/75">
            Approved / Rejected
          </TableHead>
          <TableHead className="text-stone-700 dark:text-white/75">
            Proposal Status
          </TableHead>
          <TableHead className="text-stone-700 dark:text-white/75">
            Action(s)
          </TableHead>
        </TableRow>
      </TableHeader>
    </>
  );
}
