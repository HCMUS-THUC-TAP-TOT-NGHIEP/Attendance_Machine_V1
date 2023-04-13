import { Layout, Space, Typography, theme } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import LocalizedFormat from "dayjs/plugin/localizedFormat";
import React, { useEffect, useState } from "react";
dayjs.locale("vi");
dayjs.extend(LocalizedFormat);
const { Content } = Layout;

const MyClock = (props) => {
  const { containerStyle } = props;
  const [dateState, setDateState] = useState(dayjs());
  const {
    token: { colorInfoActive },
  } = theme.useToken();

  useEffect(() => {
    setInterval(() => setDateState(dayjs()), 1000);
  }, []);
  return (
    <Space direction="vertical" align="center" style={containerStyle}>
      <Typography.Title
        level={5}
        style={{
          margin: 0,
          textTransform: "capitalize",
          color: "white",
        }}
      >
        {dateState.format("DD - MM - YYYY")}
      </Typography.Title>
      <Typography.Title
        level={2}
        style={{
          margin: 0,
          fontWeight: "bold",
          textTransform: "capitalize",
          color: "white",
        }}
      >
        {dateState.format("HH:mm:ss")}
      </Typography.Title>
      <Typography.Title
        level={3}
        style={{
          margin: 0,
          fontWeight: "bold",
          textTransform: "capitalize",
          color: "white",
        }}
      >
        {dateState.format("dddd")}
      </Typography.Title>
    </Space>
  );
};

export { MyClock };

