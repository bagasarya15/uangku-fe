import dayjs from "dayjs";
import Swal from "sweetalert2";
import id from "dayjs/locale/id";
import { Button, message } from "antd";
import AuthUser from "../../utils/AuthUser";
import EditIncome from "../component/EditIncome";
import React, { useEffect, useState } from "react";
import { apiDeleteIncome, apiGetIncome } from "../../../services/IncomeApi";
import DetailIncome from "../component/DetailIncome";

const IncomeData = ({ render }) => {
  dayjs.locale(id);

  const { user } = AuthUser();
  const [err, setErr] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
    total: 0,
  });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAlert = (valMessage) => {
    message.success(valMessage);
  };

  const fetchData = async (search = "") => {
    setLoading(true);
    try {
      let params = {
        page: search ? 1 : pagination.current,
        limit: pagination.pageSize,
        search: search,
        user_id: user?.data?.id,
      };
      const response = await apiGetIncome(params);
      if (response.status === 200) {
        setData(response.records);
        setPagination((prev) => ({
          ...prev,
          total: response.meta.total,
        }));
      }
    } catch (error) {
      setErr(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (searchValue === "") {
      fetchData("");
    }
  }, [searchValue]);

  const handlePaginationChange = (page, pageSize) => {
    setPagination((prev) => ({
      ...prev,
      current: page,
      pageSize: pageSize,
    }));
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    fetchData(searchValue);
  };

  const handleEdit = (record) => {
    setSelectedRow(record);
    setEditModalVisible(true);
    setDetailModalVisible(false);
  };

  const handleDelete = (record) => {
    setIsDeleting(true);
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: `Anda Ingin Hapus ${record?.name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      width: "400px",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteIncome(record);
      } else {
        setDetailModalVisible(false);
        setIsDeleting(false);
      }
    });
  };

  const deleteIncome = async (record) => {
    try {
      const data = await apiDeleteIncome(record.id);
      if (data.status === 200) {
        message.success(`Pemasukan ${record.name} berhasil dihapus`);
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRowClick = (record) => {
    setSelectedRow(record);
    setDetailModalVisible(true);
  };

  const handleTableClick = (record) => {
    handleRowClick(record);
  };

  const columns = [
    {
      title: "Keterangan",
      dataIndex: "name",
      key: "name",
      render: (name) => name,
      width: 200,
    },
    {
      title: "Nominal",
      dataIndex: "nominal",
      key: "nominal",
      render: (nominal) => `Rp. ${Number(nominal).toLocaleString()}`,
    },
    {
      title: "Aksi",
      render: (_, record) => (
        <span className="flex justify-center">
          <Button
            onClick={() => handleEdit(record)}
            type="file"
            className="file:py-2 file:px-4 file:rounded-full file:text-sm file:font-semibold file:bg-transparent file:text-blue-500 border border-blue-500 hover:text-white hover:bg-blue-500 hover:border-blue-500 mt-3"
          >
            Edit
          </Button>
          <span className="m-1" />
          <Button
            onClick={() => handleDelete(record)}
            type="file"
            className="file:py-2 file:px-4 file:rounded-full file:text-sm file:font-semibold file:bg-transparent file:text-red-500 border border-red-500 hover:text-white hover:bg-red-500 hover:border-red-500 mt-3"
          >
            Delete
          </Button>
        </span>
      ),
    },
  ];

  return (
    <>
      {editModalVisible && (
        <EditIncome
          visible={editModalVisible}
          onCancel={() => {
            setEditModalVisible(false);
            setDetailModalVisible(false);
          }}
          user={user}
          fetchData={fetchData}
          initialValues={selectedRow}
          handleAlert={handleAlert}
        />
      )}

      {detailModalVisible && !editModalVisible && !isDeleting && (
        <DetailIncome
          visible={detailModalVisible}
          onCancel={() => setDetailModalVisible(false)}
          selectedRow={selectedRow}
        />
      )}

      {render({
        err: err,
        data: data,
        columns: columns,
        loading: loading,
        pagination: pagination,
        searchValue: searchValue,
        selectedRow: selectedRow,
        fetchData: fetchData,
        handleAlert: handleAlert,
        handleSearchChange: handleSearchChange,
        handleSearch: handleSearch,
        handlePaginationChange: handlePaginationChange,
        handleTableClick: handleTableClick,
      })}
    </>
  );
};

export default IncomeData;
