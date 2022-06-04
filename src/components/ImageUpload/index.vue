<template>
  <div>
    <el-upload
      list-type="picture-card"
      action="#"
      :file-list="fileList"
      :limit="1"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-progress
      :percentage="percent"
      style="width: 180px"
      v-if="showPercent"
    ></el-progress>
    <el-dialog :visible="showDialog" :before-close="handleClose">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
// 实例化cos对象
const cos = new COS({
  SecretId: "AKIDEUl2HTisLer040kIhvKWUEvRl172Ztzr",
  SecretKey: "lIlgVAcqqb8RbYJrDOPHzW0IbsDRZVHu",
});
export default {
  name: "ImageUpload",
  data() {
    return {
      dialogImageUrl: "", //预览图片的地址
      showDialog: false, //预览图片的弹窗显示
      currentFileUid: "",
      fileList: [
        {
          name: "food.jpeg",
          url: "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      showPercent: false, //进度条显示隐藏
      percent: 0, //进度条进度
      // disabled: false, //控制
    };
  },
  computed: {
    // 控制上传数量为1,
    fileComputed() {
      //上传数量达到了就隐藏
      return this.fileList.length == 1;
    },
  },
  methods: {
    // handleRemove(file) {
    //   console.log(file);
    // },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.showDialog = true;
    },
    handleClose() {
      this.showDialog = false;
    },
    // 删除图片
    handleRemove(file) {
      console.log(file);
      //  删除图片时对fileList中的数据也做以一个手动删除
      this.fileList = this.fileList.filter((item) => {
        return item.uid !== file.uid;
      });
    },
    // 添加图片
    changeFile(file, fileList) {
      console.log(file, fileList);
      // 将存储的文件添加到本地列表中 // 该方法会执行很多遍  不能使用push
      this.fileList = fileList.map((item) => item);
    },
    // 图片上传之前的验证
    beforeUpload(file) {
      // 定义文件类型
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      // 检查图片类型
      if (!types.some((item) => item === file.type)) {
        // 类型不存在
        this.$message.error("上传图片只能是 JPG GIF BMP PNG 格式");
        return false;
      }
      // 检查图片大小，最大为10M
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        this.$message.error("上传的图片大小不能大于10M");
        return false;
      }

      // 记录当前上传的图片的uid
      this.currentFileUid = file.uid;

      // 进度条显示
      this.showPercent = true;
      // 允许上传
      return true;
    },
    // 上传文件,params为上传文件列表相关信息，file为文件上传列表
    upload(params) {
      if (params.file) {
        cos.putObject(
          {
            Bucket: "wendy22979-1312264027" /* 填入您自己的存储桶，必须字段 */,
            Region:
              "ap-chongqing" /* 存储桶所在地域，例如ap-beijing，必须字段 */,
            Key: params.file
              .name /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */,
            StorageClass: "STANDARD",
            Body: params.file, // 上传文件对象
            // 进度条监听
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            // 处理返回数据，上传成功返回data，data中存着存储在cos中的地址
            console.log(err || data);
            if (data.statusCode === 200) {
              this.fileList = this.fileList.map((item) => {
                if (item.uid === this.currentFileUid) {
                  item.url = "http://" + data.Location;
                  item.upload = true; //表示上传成功
                  // 上传成功后，向父组件传值
                }
                return item;
              });
              // 上传成功后，2秒后进度条隐藏并清空
              setTimeout(() => {
                this.showPercent = false; //隐藏进度条
                this.percent = 0; //进度归0
              }, 2000);
              // 像父辈传递信息
              this.$emit("getFileList","http://" + data.Location);
            }
          }
        );
      }
    },
  },
};
</script>

<style  scoped>
</style>