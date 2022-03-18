type TabPanelProps = {
  children: React.ReactNode;
  value: number;
  index: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...others } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...others}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

export default TabPanel;
