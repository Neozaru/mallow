import { flexRender } from '@tanstack/react-table';
import styled from 'styled-components';

const TableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid rgb(50, 15, 105);
  border-radius: 8px;
  background-color: #1e093f;
`;

const TableHeader = styled.div`
  display: flex;
  background-color: #1e093f;
  color: white;
  font-weight: bold;
  text-align: left;

  & > div {
    flex: 1;
    cursor: pointer;
  }

  // Last th
  div > div:last-child {
   text-align: right;
  }
`;

const TableRow = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid rgb(50, 15, 105);

  &:nth-child(even) {
    background-color: #1e093f;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #1e093f;
  }
`;

interface CustomAlignProp {
  align?: 'left' | 'center' | 'right';  // Define the possible values for `align`
}

const TableCell = styled.div<CustomAlignProp>`
  flex: 1;
  padding: 5px 5px;
  text-align: ${({ align }) => align || 'left'};
  white-space: nowrap;
  
  &:first-child {
    flex: 2;
  }
`;

const MallowTable = ({ table }) => {
  return (
    <TableWrapper>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableCell
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: 'pointer' }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' ▲',
                      desc: ' ▼',
                    }[header.column.getIsSorted() as string] || null}
                    {header.column.getCanGroup() ? (
                      <button
                        {...{
                          onClick: header.column.getToggleGroupingHandler(),
                          style: {
                            cursor: 'pointer',
                          },
                        }}
                      >
                        {header.column.getIsGrouped()
                          ? `🛑(${header.column.getGroupedIndex()}) `
                          : `👊 `}
                      </button>
                    ) : null}{' '}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} className={cell.id === 'apy' ? 'apyCell' : ''}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableWrapper>
  )
}

export default MallowTable
