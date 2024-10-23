"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "../primitives/pagination";

export default function PaginationSection({
  page,
  transactionsLength,
}: {
  page: string;
  transactionsLength: number;
}) {
  return (
    <Pagination>
      <PaginationContent className="mt-4">
        {page != "1" ||
          (!page && (
            <PaginationItem>
              <PaginationPrevious
                href={`/transactions?page=${parseInt(page) - 1}`}
                className="font-neuemedium hover:text-stone-500"
              />
            </PaginationItem>
          ))}
        {transactionsLength > 10 && (
          <PaginationItem>
            <PaginationNext
              href={`/transactions?page=${parseInt(page) + 1}`}
              className="font-neuemedium hover:text-stone-500"
            />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}
