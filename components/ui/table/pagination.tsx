"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
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
        {parseInt(page) == 1 ? null : (
          <>
            <PaginationItem>
              <PaginationPrevious
                href={`/transactions?page=1`}
                className="hover:bg-neutral-500"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href={`/transactions?page=${parseInt(page) - 1}`}
                className="hover:bg-neutral-500"
              >
                {parseInt(page) - 1}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
        <PaginationItem>
          <PaginationLink
            href=""
            className="!active:bg-neutral-700 !active:hover:bg-neutral-500"
            isActive
          >
            {parseInt(page)}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href={`/transactions?page=${parseInt(page) + 1}`}
            className="hover:bg-neutral-500"
          >
            {parseInt(page) + 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={`/transactions?page=${transactionsLength % 10}`}
            className="hover:bg-neutral-500"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
