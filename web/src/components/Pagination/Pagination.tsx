import React, { useMemo } from 'react'
import ReactPaginate from 'react-paginate'

import { DefaultComponentProps } from '@mui/material/OverridableComponent'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Card, { type CardTypeMap } from '@mui/joy/Card'
import Stack from '@mui/joy/Stack'

interface IPaginationProps {
  children?: React.ReactNode
  pageCount: number
  currentPage: number
  onPageChange: (e: { selected: number }) => void
}

const Pagination: React.FC<IPaginationProps> = ({
  currentPage: page = 1,
  pageCount = 1,
  onPageChange,
}) => {
  const currentPage = page < 0 ? 0 : (page - 1)
  const paginationItemsProps: DefaultComponentProps<CardTypeMap> = {
    size: 'sm',
    variant: 'outlined',
    sx: {
      width: 38,
      height: 38,
      display: 'flex',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }

  const PageLabel = (index: number) => (
    <Card color={index == (currentPage + 1) ? 'primary' : 'neutral'} {...paginationItemsProps}>
      {index}
    </Card>
  )

  const disabledNext = useMemo(() => (currentPage + 1) < pageCount, [currentPage, pageCount])
  const NextLabel: React.ReactNode = (
    <Card
      {...paginationItemsProps}
      sx={{
        ...paginationItemsProps.sx,
        opacity: disabledNext ? 1 : 0.5,
        cursor: disabledNext ? 'pointer' : 'not-allowed'
      }}
    >
      <ArrowForwardIcon />
    </Card>
  )

  const disabledPrev = useMemo(() => Boolean(currentPage), [currentPage])
  const PrevLabel: React.ReactNode = (
    <Card
      {...paginationItemsProps}
      sx={{
        ...paginationItemsProps.sx,
        opacity: disabledPrev ? 1 : 0.5,
        cursor: disabledPrev ? 'pointer' : 'not-allowed'
      }}
    >
      <ArrowBackIcon />
    </Card>
  )

  return (
    <Stack
      mt={3}
      spacing={1}
      justifyContent="center"
      direction="row"
      breakLabel="..."
      pageCount={pageCount}
      nextLabel={NextLabel}
      pageRangeDisplayed={5}
      forcePage={currentPage}
      component={ReactPaginate}
      previousLabel={PrevLabel}
      pageLabelBuilder={PageLabel}
      renderOnZeroPageCount={null}
      onPageChange={onPageChange}
    />
  )
}

export default Pagination
