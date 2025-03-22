/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { CommonStyleType } from "node_modules/oh-my-live2d/dist/types/common";
import { loadOml2d, Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import { memo, useEffect, useRef } from "react";

type Oml2dProps = {
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
  setOml2d: React.Dispatch<React.SetStateAction<(Oml2dProperties & Oml2dMethods & Oml2dEvents) | null>>;
}

const Oml2d = memo(({ oml2d, setOml2d }: Oml2dProps) => {
  const oml2dRef = useRef<HTMLDivElement>(null);
  // 修改为使用联合类型，允许初始值为 null
  // const [oml2d, setOml2d] = useState<(Oml2dProperties & Oml2dMethods & Oml2dEvents) | null>(null);

  const getPositionX = () => {
    return oml2dRef.current ? oml2dRef.current.offsetWidth * 0.2 : 120;
  };

  const getScale = () => {
    return oml2dRef.current ? oml2dRef.current.offsetHeight * 0.0005 : 0.2;
  }

  useEffect(() => {
    const tipsStyle: CommonStyleType = {
      borderRadius: "50px",
      backgroundColor: "rgba(255,255,255, 0.1)", // 设置背景颜色为黑色，透明度为 0.5
      backdropFilter: "blur(10px)", // 添加模糊效果
      color: "#ffffff", // 添加文字颜色为白色
      border: "none", // 移除边框
      padding: "10px 20px", // 添加内边距
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // 添加阴影效果
      fontSize: "18px", // 设置字体大小
      textAlign: "center", // 文字居中对齐
    }
    const stageStyle: CommonStyleType = {
      width: "100%",
      height: "100%",
    }
    if (oml2d) {
      // @ts-ignore
      oml2d.options.tips!.style = {
        // @ts-ignore
        ...oml2d.options.tips!.style,
        ...tipsStyle,
      }
      // @ts-ignore
      oml2d.options.tips!.mobileStyle = {
        // @ts-ignore
        ...oml2d.options.tips!.mobileStyle,
        ...tipsStyle,
      }
      oml2d.reloadModel();
      return;
    }

    const newOml2d = loadOml2d({
      parentElement: oml2dRef.current!,
      mobileDisplay: true,
      dockedPosition: "right",
      sayHello: false,
      menus: {
        disable: true,
      },
      statusBar: {
        disable: true,
      },
      stageStyle: {
        ...stageStyle
      },
      tips: {
        style: {
          ...tipsStyle
        },
        mobileStyle: {
          ...tipsStyle
        }
      },
      transitionTime: 1000,
      models: [
        {
          path: "/models/cat-white/model.json",

          position: [getPositionX(), 0],
          name: "whiteCat",
          scale: getScale(),
          mobileScale: getScale(),
        },
        {
          path: "/models/cat-black/model.json",
          name: "blackCat",
          position: [getPositionX(), 0],
          scale: getScale(),
          mobileScale: getScale(),
        },
      ],
    });

    newOml2d.onLoad((state) => {
      console.log(state);
      switch (state) {
        case "success":
          console.log("加载成功");
          break;
        case "fail":
          console.log("加载失败");
          break;
        case "loading":
          console.log("加载中");
          break;
        default:
          break;
      }
    });

    setOml2d(newOml2d);

    newOml2d.loadModelByName("whiteCat");
  }, [oml2d]);

  useEffect(() => {
    oml2d?.tipsMessage("你才是猫娘，你全家都是猫娘！", 30000, 100);
    oml2d?.onStageSlideIn(() => {
      oml2d?.setModelPosition({ x: getPositionX() })
      oml2d?.setModelScale(getScale());
    })
    oml2d?.onStageSlideOut(() => {
      oml2d?.setModelPosition({ x: getPositionX() })
      oml2d?.setModelScale(getScale());
    })
  }, [oml2d])

  useEffect(() => {
    const handleResize = () => {
      oml2d?.setModelPosition({ x: getPositionX() })
      oml2d?.setModelScale(getScale());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div
    ref={oml2dRef}
    className="w-full bg-cover bg-center flex justify-center overflow-hidden p-4 pb-0"
    style={{ backgroundImage: 'url(/images/bg.webp)', aspectRatio: '16 / 9' }}></div>;
});

export default Oml2d;
