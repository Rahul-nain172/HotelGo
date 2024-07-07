import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { savePage } from "@/redux/search/searchSlice";
import { useSelector, useDispatch } from "react-redux";

export default function Paginationn() {
const searchResults = useSelector((state) => state.searchResults);
const { page } = useSelector((state) => state.searchOptions);
const dispatch = useDispatch();
const changePage = (value) => {
  dispatch(savePage(value));
}

const totalPages = Math.ceil((searchResults.count || 0) / 5);

return (

  <Pagination className='my-4 '>
    <PaginationContent>
      <PaginationItem>
        <PaginationPrevious className='text-lg'
          href="#"
          onClick={() => changePage(page > 1 ? page - 1 : 1)}
        />
      </PaginationItem>
      {Array.from({ length: totalPages }, (_, index) => (
        <PaginationItem key={index} className='text-lg'>
          <PaginationLink
            href="#"
            onClick={() => changePage(index + 1)}
          >
            {index + 1}
          </PaginationLink>
        </PaginationItem>
      ))}
      {totalPages > 5 && (
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
      )}
      <PaginationItem>
        <PaginationNext className='text-lg'
          href="#"
          onClick={() => changePage(page<totalPages?page+1:page)}
        />
      </PaginationItem>
    </PaginationContent>
  </Pagination>
)
}
