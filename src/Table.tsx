import {
    ActionsColumn,
    IAction,
    InnerScrollContainer,
    OuterScrollContainer,
    TableComposable,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@patternfly/react-table'
import { Fragment, useMemo, useState } from 'react'
import { useWindowSizeOrLarger, useWindowSizeOrSmaller, WindowSize } from './components/useBreakPoint'
import { ITableColumn } from './TableColumn'

export function DataTable<T extends object>(props: {
    columns: ITableColumn<T>[]
    items: T[]
    selectItem: (item: T) => void
    unselectItem: (item: T) => void
    isSelected: (item: T) => boolean
    keyFn: (item: T) => string
    rowActions?: IAction[]
}) {
    const isStickyColumn = useWindowSizeOrLarger(WindowSize.sm)
    const { columns, items, selectItem, unselectItem, isSelected, keyFn, rowActions } = props
    const [scrollLeft, setScrollLeft] = useState(0)
    return useMemo(
        () => (
            <OuterScrollContainer style={{ height: '100%' }}>
                <InnerScrollContainer
                    onScroll={(div) => {
                        // console.log((div.target as HTMLDivElement).scrollLeft)
                        setScrollLeft((div.target as HTMLDivElement).scrollLeft)
                    }}
                    style={{ height: '100%' }}
                >
                    <TableComposable
                        aria-label="Simple table"
                        // variant="compact"
                        // variant={exampleChoice !== 'default' ? 'compact' : undefined}
                        // borders={exampleChoice !== 'compactBorderless'}
                        isStickyHeader
                        gridBreakPoint=""
                    >
                        <TableHead columns={columns} isStickyColumn={isStickyColumn} scrollLeft={scrollLeft} rowActions={rowActions} />
                        <Tbody>
                            {items.map((item) => (
                                <TableRow<T>
                                    key={keyFn(item)}
                                    columns={columns}
                                    item={item}
                                    isItemSelected={isSelected(item)}
                                    isStickyColumn={isStickyColumn}
                                    scrollLeft={scrollLeft}
                                    selectItem={selectItem}
                                    unselectItem={unselectItem}
                                    rowActions={rowActions}
                                />
                            ))}
                        </Tbody>
                    </TableComposable>
                </InnerScrollContainer>
            </OuterScrollContainer>
        ),
        [columns, isSelected, isStickyColumn, keyFn, items, rowActions, scrollLeft, selectItem, unselectItem]
    )
}

function TableHead<T extends object>(props: {
    columns: ITableColumn<T>[]
    isStickyColumn: boolean
    scrollLeft: number
    rowActions?: IAction[]
}) {
    const { columns, isStickyColumn, scrollLeft, rowActions } = props
    let stickyLeftOffset = '53px'
    if (useWindowSizeOrSmaller(WindowSize.md)) {
        stickyLeftOffset = '45px'
    }
    return useMemo(
        () => (
            <Thead>
                <Tr>
                    <Th
                        // select={{
                        //     onSelect: (_event, isSelecting) => {
                        //         if (isSelecting) {
                        //             selectAll()
                        //         } else {
                        //             unselectAll()
                        //         }
                        //     },
                        //     isSelected: allSelected,
                        // }}
                        hasRightBorder={!isStickyColumn && scrollLeft > 0}
                        isStickyColumn={true}
                        stickyMinWidth="0"
                    />

                    {columns
                        .filter((column) => column.enabled !== false)
                        .map((column, index) => {
                            if (index === 0) {
                                return (
                                    <Th
                                        key={column.header}
                                        // modifier="wrap"
                                        style={{ minWidth: column.minWidth }}
                                        isStickyColumn={isStickyColumn}
                                        // hasRightBorder={isStickyColumn}
                                        hasRightBorder={isStickyColumn && scrollLeft > 0}
                                        stickyMinWidth={column.minWidth ? `${column.minWidth}px` : undefined}
                                        stickyLeftOffset={stickyLeftOffset}
                                    >
                                        {column.header}
                                    </Th>
                                )
                            }
                            return (
                                <Th
                                    key={column.header}
                                    // modifier="wrap"
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.header}
                                </Th>
                            )
                        })}
                    {rowActions !== undefined && <Th></Th>}
                </Tr>
            </Thead>
        ),
        [columns, isStickyColumn, rowActions, scrollLeft, stickyLeftOffset]
    )
}

function TableRow<T extends object>(props: {
    columns: ITableColumn<T>[]
    isStickyColumn: boolean
    scrollLeft: number
    item: T
    isItemSelected: boolean
    selectItem: (item: T) => void
    unselectItem: (item: T) => void
    rowActions?: IAction[]
}) {
    const { columns, isStickyColumn, scrollLeft, selectItem, unselectItem, isItemSelected, item, rowActions } = props
    return useMemo(
        () => (
            <Tr>
                <Th
                    select={{
                        // rowIndex,
                        onSelect: (_event, isSelecting) => {
                            if (isSelecting) {
                                selectItem(item)
                            } else {
                                unselectItem(item)
                            }
                        },
                        isSelected: isItemSelected,
                        // disable: !isRepoSelectable(repo),
                    }}
                    hasRightBorder={!isStickyColumn && scrollLeft > 0}
                    isStickyColumn={true}
                    stickyMinWidth="0"
                />
                <TableCells columns={columns} isStickyColumn={isStickyColumn} scrollLeft={scrollLeft} item={item} rowActions={rowActions} />
            </Tr>
        ),
        [columns, isItemSelected, isStickyColumn, item, rowActions, scrollLeft, selectItem, unselectItem]
    )
}

function TableCells<T extends object>(props: {
    columns: ITableColumn<T>[]
    isStickyColumn: boolean
    scrollLeft: number
    item: T
    rowActions?: IAction[]
}) {
    const { columns, isStickyColumn, scrollLeft, item, rowActions } = props

    let stickyLeftOffset = '53px'
    if (useWindowSizeOrSmaller(WindowSize.md)) {
        stickyLeftOffset = '45px'
    }

    return useMemo(
        () => (
            <Fragment>
                {columns
                    .filter((column) => column.enabled !== false)
                    .map((column, columnIndex) => {
                        if (columnIndex === 0 && isStickyColumn) {
                            return (
                                <Th
                                    key={column.header}
                                    dataLabel={column.header}
                                    isStickyColumn={isStickyColumn}
                                    hasRightBorder={scrollLeft > 0}
                                    stickyMinWidth="0"
                                    stickyLeftOffset={stickyLeftOffset}
                                    modifier="nowrap"
                                >
                                    {column.cell(item)}
                                </Th>
                            )
                        }
                        return (
                            <Td key={column.header} dataLabel={column.header} modifier="nowrap">
                                {column.cell(item)}
                            </Td>
                        )
                    })}
                {rowActions !== undefined && (
                    <Td isActionCell>
                        <ActionsColumn
                            // dropdownDirection="up" // TODO handle....
                            items={rowActions}
                            // isDisabled={repo.name === '4'} // Also arbitrary for the example
                            // actionsToggle={exampleChoice === 'customToggle' ? customActionsToggle : undefined}
                        />
                    </Td>
                )}
            </Fragment>
        ),
        [columns, isStickyColumn, item, rowActions, scrollLeft, stickyLeftOffset]
    )
}

// function TablePagination(props: {
//     itemCount: number
//     page: number
//     perPage: number
//     onSetPage: (event: unknown, page: number) => void
//     onPerPageSelect: (event: unknown, perPage: number) => void
// }) {
//     const { itemCount, page, perPage, onSetPage, onPerPageSelect } = props
//     return useMemo(
//         () => (
//             <Pagination
//                 itemCount={itemCount}
//                 widgetId="pagination-options-menu-bottom"
//                 perPage={perPage}
//                 page={page}
//                 variant={PaginationVariant.bottom}
//                 onSetPage={onSetPage}
//                 onPerPageSelect={onPerPageSelect}
//                 // perPage={this.state.perPage}
//                 // page={this.state.page}
//                 // variant={PaginationVariant.bottom}
//                 // onSetPage={this.onSetPage}
//                 // onPerPageSelect={this.onPerPageSelect}
//                 style={{ borderTop: '1px solid var(--pf-global--BorderColor--dark-100)', marginTop: -1, zIndex: 300 }}
//             />
//         ),
//         [itemCount, onPerPageSelect, onSetPage, page, perPage]
//     )
// }
