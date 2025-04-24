export default function OrderDetails({ order }) {
  return (
    <div className="space-y-4 pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground">Khách hàng</h3>
          <p>{order.customerName}</p>
        </div>
        <div>
          <h3 className="font-medium text-sm text-muted-foreground">Trạng thái</h3>
          <p>{order.status}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="font-medium mb-2">Chi tiết sản phẩm</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Sản phẩm</p>
            <p className="font-medium">{order.productName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Màu sắc</p>
            <p className="font-medium">{order.color || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Size</p>
            <p className="font-medium">{order.size || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Số lượng</p>
            <p className="font-medium">{order.quantity}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Đơn giá</p>
            <p className="font-medium">{order.price?.toLocaleString("vi-VN")} đ</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Thành tiền</p>
            <p className="font-medium">{order.total?.toLocaleString("vi-VN")} đ</p>
          </div>
        </div>
      </div>

      {(order.linkFb || order.contactInfo) && (
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Thông tin liên hệ</h3>
          {order.linkFb && (
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">Link Facebook</p>
              <a
                href={order.linkFb}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {order.linkFb}
              </a>
            </div>
          )}
          {order.contactInfo && (
            <div>
              <p className="text-sm text-muted-foreground">SĐT + Địa chỉ</p>
              <p>{order.contactInfo}</p>
            </div>
          )}
        </div>
      )}

      {order.note && (
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Ghi chú</h3>
          <p className="text-sm">{order.note}</p>
        </div>
      )}

      {order.productImage && (
        <div className="border-t pt-4">
          <h3 className="font-medium mb-2">Hình ảnh</h3>
          <img
            src={order.productImage || "/placeholder.svg"}
            alt={order.productName}
            className="max-h-48 object-contain rounded-md border"
          />
        </div>
      )}
    </div>
  )
}
