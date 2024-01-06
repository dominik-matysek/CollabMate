import { Table } from "antd";

function CustomTable({ data, columns, onRowClick }) {
  return (
    <Table
      dataSource={data}
      columns={columns}
      onRow={onRowClick}
      className="mt-4"
    />
  );
}
export default CustomTable;
