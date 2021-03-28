// import React, { useEffect } from "react";
// import { Terminal } from "xterm";

// function Webssh() {
//   useEffect(() => {
//     let term = new Terminal({
//       rendererType: "canvas", //渲染类型
//       rows: 10, //行数
//       convertEol: true, //启用时，光标将设置为下一行的开头
//       scrollback: 10, //终端中的回滚量
//       disableStdin: false, //是否应禁用输入。
//       cursorStyle: "underline", //光标样式
//       cursorBlink: true, //光标闪烁
//       theme: {
//         foreground: "yellow", //字体
//         background: "#060101", //背景色
//         cursor: "help", //设置光标
//       },
//     });

//     term.open(document.getElementById("terminal"));
//     term.write("Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ");
//     term.onData((val) => {
//       term.write(val);
//     });

//     function runFakeTerminal() {
//       if (term._initialized) {
//         return;
//       }

//       term._initialized = true;

//       term.prompt = () => {
//         term.write("\r\n$ ");
//       };

//       term.writeln("Welcome to xterm.js");
//       term.writeln(
//         "This is a local terminal emulation, without a real terminal in the back-end."
//       );
//       term.writeln("Type some keys and commands to play around.");
//       term.writeln("");
//       term.prompt();

//       term.onKey(function (key, ev) {
//         const printable =
//           !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey;
//         console.log(key, ev.keyCode);
//         console.log(term._core.buffer.x);

//         if (ev.keyCode === 13) {
//           term.prompt();
//         } else if (ev.keyCode === 8) {
//           // Do not delete the prompt
//           if (term._core.buffer.x > 2) {
//             term.write("\b \b");
//           }
//         } else if (printable) {
//           term.write(key);
//         }
//       });

//       //   term.on("paste", function (data) {
//       //     term.write(data);
//       //   });
//     }
//     runFakeTerminal();
//   }, []);

//   return <div id="terminal" style={{ height: "300px" }} />;
// }

// export default Webssh;

import React, { useEffect, useState } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
// import '../node_modules/xterm/css/xterm.css'   //如果你的xterm样式乱了，需要调整这个路径
import "./../../../../node_modules/xterm/css/xterm.css";

//我后来是直接把这个css  copy到项目目录下进行引用
//定义xterm的外观  具体看xterm文档
const Webssh = (props) => {
  useEffect(() => {
    const term = new Terminal({
      rendererType: "canvas",
      cursorBlink: true,
      convertEol: true,
      scrollback: 800,
      row: 70,
      theme: {
        foreground: "white",
        background: "#181E29",
      },
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    fitAddon.fit();
    term.open(document.getElementById("terminal" + props.index)); //绑定dom节点
    term.writeln("Connecting...");

    // const socket = new WebSocket(
    //   "wss://docker.example.com/containers/mycontainerid/attach/ws"
    // );

    let socket = new WebSocket("ws://192.168.3.155:8008/webssh"); //地址

    // console.log(socket);

    const attachAddon = new AttachAddon(socket);
    term.loadAddon(attachAddon);

    //输入内容 将内容传给服务器
    let writeString = "";
    term.onKey((e) => {
      // term.write(e.key);
      console.log(e);
      //   socket.send(
      //     JSON.stringify({ operate: "command", command: e.key, module: "webssh" })
      //   );
      switch (e.domEvent.code) {
        case "Backspace":
          writeString = writeString.substring(0, -1);
          return;
        case "Enter":
          console.log("enter", writeString);
          return;
        default:
          writeString += e.key;
      }
      term.write(e.key);
    });

    const operate = {
      onError: function (error) {
        //连接失败回调
        term.write("Error: " + error + "\r\n");
      },
      onConnect: function (option) {
        //连接成功回调
        socket.send(JSON.stringify(option)); //连接成功的回调
      },
      onClose: function () {
        //连接关闭回调
        term.write("\rconnection closed");
      },
      onData: function (data) {
        //收到数据时回调
        term.write(data);
        term.focus();
      },
    };

    if (window.WebSocket) {
      //如果支持websocket
      // this._connection = new WebSocket(endpoint);
      console.log("good!!!");
    } else {
      //否则报错
      operate.onError("WebSocket Not Supported");
      return;
    }
    //连接成功
    socket.onopen = function () {
      operate.onConnect();
    };
    socket.onmessage = function (evt) {
      let data = evt.data.toString();
      //data = base64.decode(data);
      console.log("data", data);
      operate.onData(data);
    };
    socket.onclose = function (evt) {
      operate.onClose();
    };
  }, []);

  return <div id={"terminal" + props.index}></div>;
  return null;
};

export default Webssh;
