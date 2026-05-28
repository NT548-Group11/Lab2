import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Card,
  Input,
  Modal,
  Form,
  message,
  Space,
  Popconfirm,
} from "antd";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryService";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryAdmin = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  //getCategories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await getCategories();
      setCategories(res);
    } catch {
      message.error("Không thể tải danh mục!");
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  //FilterCategories
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );
  //handleAdd
  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  };
  //handleEdit
  const handleEdit = (record) => {
    setEditingCategory(record);

    form.setFieldsValue({
      name: record.name,
      attributes: record.attributes?.map((attr) => ({
        name: attr.name,
        values: attr.values || [],
      })),
    });

    setModalOpen(true);
  };
  //handleDelete
  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Xóa danh mục thành công!");
      fetchCategories();
    } catch {
      message.error("Xóa thất bại!");
    }
  };
  //Submit
  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitLoading(true);
      if (editingCategory) {
        await updateCategory(editingCategory._id, values);
        message.success("Done");
      } else {
        await createCategory(values);
        message.success("Done");
      }
      setModalOpen(false);
      form.resetFields();
      fetchCategories();
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    { title: "Tên danh mục", dataIndex: "name", key: "name" },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn chắc chắn muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger icon={<DeleteOutlined />} size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: "#fff", borderRadius: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Quản lý danh mục sản phẩm</h2>
        {/* Button search + add new category*/}
        <div style={{ display: "flex", gap: 8 }}>
          <Input
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 240 }}
            allowClear
          />
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              handleAdd();
            }}
          >
            Thêm danh mục
          </Button>
        </div>
      </div>
      <Modal
        destroyOnHidden
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        onOk={handleModalOk}
        confirmLoading={submitLoading}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form layout="vertical" form={form}>
          {/* Tên category */}
          <Form.Item
            label="Tên danh mục"
            name="name"
            rules={[{ required: true, message: "Nhập tên danh mục" }]}
          >
            <Input placeholder="Ví dụ: Quần áo nữ" />
          </Form.Item>
          {/* Attributes */}
          <Form.List name="attributes">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    style={{ marginBottom: 16 }}
                    title={`Thuộc tính ${index + 1}`}
                    extra={
                      <Button
                        danger
                        type="text"
                        onClick={() => remove(field.name)}
                      >
                        Xóa
                      </Button>
                    }
                  >
                    {/* Tên attribute */}
                    <Form.Item
                      {...field}
                      name={[field.name, "name"]}
                      label="Tên thuộc tính"
                      rules={[
                        { required: true, message: "Nhập tên thuộc tính" },
                      ]}
                    >
                      <Input placeholder="Ví dụ: Size" />
                    </Form.Item>

                    {/* Values */}
                    <Form.List name={[field.name, "values"]}>
                      {(
                        valueFields,
                        { add: addValue, remove: removeValue },
                      ) => (
                        <>
                          {valueFields.map((valField) => (
                            <Space
                              key={valField.key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...valField}
                                name={valField.name}
                                rules={[
                                  { required: true, message: "Nhập giá trị" },
                                ]}
                                style={{ marginBottom: 0, flex: 1 }}
                              >
                                <Input placeholder="Ví dụ: S" />
                              </Form.Item>

                              <Button
                                danger
                                onClick={() => removeValue(valField.name)}
                              >
                                Xóa
                              </Button>
                            </Space>
                          ))}

                          <Button
                            type="dashed"
                            onClick={() => addValue()}
                            block
                          >
                            + Thêm giá trị
                          </Button>
                        </>
                      )}
                    </Form.List>
                  </Card>
                ))}
                <Button type="dashed" block onClick={() => add()}>
                  + Thêm thuộc tính
                </Button>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
};

export default CategoryAdmin;
