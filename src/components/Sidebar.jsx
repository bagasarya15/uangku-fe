import { Layout } from "antd";
import ListMenu from "./ListMenu";

const { Sider } = Layout;
const Sidebar = ({ collapsed }) => {
	return (
		<Sider
			theme="light"
			trigger={null}
			collapsible
			collapsed={collapsed}
			collapsedWidth={0}
			width={200}
			style={{
				display: collapsed ? "none" : "block",
				// backgroundColor: "#3b82f6",
			}}
		>
			<div className="bg-white pt-[10px]">
				<div className="pb-[19px]">
					<div className="mt-3 text-center">
						<h1 class="font-bold">
							<span class="text-blue-700">UANG</span>
							<span class="text-gray-950">KU</span>
						</h1>
					</div>
				</div>
			</div>
			<ListMenu />
		</Sider>
	);
};

export default Sidebar;
