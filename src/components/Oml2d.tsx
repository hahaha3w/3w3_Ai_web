/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { MODELS } from "@/models/modelDefinitions";
import { CommonStyleType } from "node_modules/oh-my-live2d/dist/types/common";
import {
  loadOml2d,
  Oml2dEvents,
  Oml2dMethods,
  Oml2dProperties,
} from "oh-my-live2d";
import { memo, useEffect, useRef } from "react";
import styles from "./Oml2d.module.scss";

type Oml2dProps = {
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
  setOml2d: React.Dispatch<
    React.SetStateAction<(Oml2dProperties & Oml2dMethods & Oml2dEvents) | null>
  >;
};

const Oml2d = memo(({ oml2d, setOml2d }: Oml2dProps) => {
  const oml2dRef = useRef<HTMLDivElement>(null);

  const getPositionX = (xAdjust = 1) => {
    if (window.innerWidth < 768) {
      return oml2dRef.current
        ? oml2dRef.current.offsetWidth * 0.05 * xAdjust
        : 120;
    }
    return oml2dRef.current
      ? oml2dRef.current.offsetWidth * 0.2 * xAdjust
      : 120;
  };

  const getPositionY = (yAdjust = 1) => {
    const containerHeight = oml2dRef.current
      ? oml2dRef.current.offsetHeight
      : 600;
    if (window.innerWidth < 768) {
      return containerHeight * 0.05 * yAdjust;
    }
    return containerHeight * 0.1 * yAdjust;
  };

  const getScale = (adjustRatio = 1) => {
    if (window.innerWidth < 768) {
      const baseScale = oml2dRef.current
        ? oml2dRef.current.offsetWidth * 0.0005
        : 0.2;
      const scale = baseScale > 0.25 ? 0.25 : baseScale;
      return scale * adjustRatio;
    }
    const baseScale = oml2dRef.current
      ? oml2dRef.current.offsetHeight * 0.0005
      : 0.2;
    const scale = baseScale > 0.3 ? 0.3 : baseScale;
    return scale * adjustRatio;
  };

  useEffect(() => {
    const tipsStyle: CommonStyleType = {
      borderRadius: "50px",
      backgroundColor: "rgba(255,255,255, 0.1)",
      backdropFilter: "blur(10px)",
      color: "#ffffff",
      border: "none",
      padding: "10px 20px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      fontSize: "18px",
      textAlign: "center",
      zIndex: "100000",
    };
    const stageStyle: CommonStyleType = {
      width: "100%",
      height: "100%",
    };
    if (oml2d) {
      // @ts-ignore
      oml2d.options.tips!.style = {
        // @ts-ignore
        ...oml2d.options.tips!.style,
        ...tipsStyle,
      };
      // @ts-ignore
      oml2d.options.tips!.mobileStyle = {
        // @ts-ignore
        ...oml2d.options.tips!.mobileStyle,
        ...tipsStyle,
      };
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
        ...stageStyle,
      },
      tips: {
        style: {
          ...tipsStyle,
        },
        mobileStyle: {
          ...tipsStyle,
        },
      },
      transitionTime: 1000,
      models: MODELS.map((model) => ({
        path: model.path,
        name: model.id,
        position: [getPositionX(model.xAdjust), getPositionY(model.yAdjust)],
        scale: getScale(model.scaleAdjust),
        mobileScale: getScale(model.scaleAdjust),
      })),
    });

    newOml2d.onLoad((state) => {
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

    // 使用索引加载默认模型
    newOml2d.loadModelByIndex(0);
  }, [oml2d]);

  useEffect(() => {
    oml2d?.onStageSlideIn(() => {
      const currentModelIndex = oml2d.modelIndex;
      const model = MODELS[currentModelIndex];

      oml2d?.setModelPosition({
        x: getPositionX(model?.xAdjust || 1),
        y: getPositionY(model?.yAdjust || 1),
      });
      oml2d?.setModelScale(getScale(model?.scaleAdjust || 1));
    });

    oml2d?.onStageSlideOut(() => {
      const currentModelIndex = oml2d.modelIndex;
      const model = MODELS[currentModelIndex];

      oml2d?.setModelPosition({
        x: getPositionX(model?.xAdjust || 1),
        y: getPositionY(model?.yAdjust || 1),
      });
      oml2d?.setModelScale(getScale(model?.scaleAdjust || 1));
    });
  }, [oml2d]);

  useEffect(() => {
    const handleResize = () => {
      const currentModelIndex = oml2d?.modelIndex || 0;
      const model = MODELS[currentModelIndex];

      oml2d?.setModelPosition({
        x: getPositionX(model?.xAdjust || 1),
        y: getPositionY(model?.yAdjust || 1),
      });
      oml2d?.setModelScale(getScale(model?.scaleAdjust || 1));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [oml2d]);

  return (
    <div
      ref={oml2dRef}
      className={`w-full bg-cover bg-center flex justify-center overflow-hidden pt-8 ${styles.container}`}
    ></div>
  );
});

export default Oml2d;
