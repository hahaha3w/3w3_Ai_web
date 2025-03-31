import { FC, useEffect } from "react";
import MessageCard from "./MessageCard";
import { ApiKeys } from "@/constants/apiKeys";
import Api from "@/service/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Empty, Spin } from "antd";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRefetchStore } from "@/store/refetch";
import { Icon } from "@iconify-icon/react/dist/iconify.js";

const MessageBox: FC = () => {
  const { setRefetchActionList } = useRefetchStore();
  const { data, status, refetch, fetchNextPage, isRefetching } =
    useInfiniteQuery({
      queryKey: [ApiKeys.activityList],
      queryFn: ({ pageParam = 1 }) =>
        Api.activityApi.getActivities(pageParam, 5),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages, lastPageParam) => {
        if (!lastPage.activities || !lastPage?.activities?.length)
          return undefined;
        return lastPageParam + 1;
      },
    });

  useEffect(() => {
    setRefetchActionList(refetch);
  }, [refetch, setRefetchActionList]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start gap-3 bg-white rounded-2xl px-2">
      {/* Title */}
      <div className="w-full flex flex-row justify-between items-center border-b pb-2">
        <div className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <Icon icon="mdi:bell-outline" className="text-blue-500" />
          互动消息
        </div>
      </div>
      <div
        className="w-full h-[420px] overflow-auto custom-scrollbar"
        id="message_box_id"
      >
        {status == "pending" && (
          <div className="w-full h-full flex items-center justify-center">
            <Spin tip="加载中" />
          </div>
        )}
        {status == "error" && (
          <div className="w-full h-full flex items-center justify-center text-red-500">
            <Icon icon="mdi:alert-circle-outline" className="mr-2" />
            加载失败，请稍后重试
          </div>
        )}
        {data &&
        data.pages[0]?.activities &&
        data.pages[0].activities.length > 0 ? (
          <InfiniteScroll
            className="px-1 space-y-3"
            hasMore={data.pages[data.pages.length - 1].hasMore}
            dataLength={
              data?.pages.reduce(
                (total, page) => total + page.activities.length,
                0
              ) || 0
            }
            next={() => {
              if (!isRefetching) fetchNextPage();
            }}
            refreshFunction={() => {
              if (!isRefetching) refetch();
            }}
            loader={
              <div className="w-full text-center py-2">
                <Spin size="small" />
              </div>
            }
            endMessage={
              <div className="w-full text-center py-3 text-sm text-gray-400 flex justify-center items-center gap-1">
                <Icon icon="mdi:check-circle-outline" />
                已经到底啦
              </div>
            }
            scrollableTarget="message_box_id"
          >
            <div className="w-full flex flex-col justify-start items-center gap-3">
              {data.pages.map((innerData, pageIndex) => {
                return innerData.activities.map((item, index) => (
                  <MessageCard key={`${pageIndex}-${index}`} {...item} />
                ));
              })}
            </div>
          </InfiniteScroll>
        ) : (
          <Empty
            className="mt-16"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无消息"
          />
        )}
      </div>
    </div>
  );
};
export default MessageBox;
