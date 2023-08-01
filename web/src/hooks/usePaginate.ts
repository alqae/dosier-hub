import { useState } from "react"

export const usePaginate = (limit = 10) => {
  const [page, setPage] = useState(0)

  /**
   * Handles the page click event.
   *
   * @param {object} event - The event object containing the selected page.
   * @param {number} event.selected - The index of the selected page.
   * @return {void}
   */
  const handlePageClick = (event: { selected: number }): void =>
    setPage(event.selected)

  return {
    limit,
    page: (page + 1),
    handlePageClick,
  }
}