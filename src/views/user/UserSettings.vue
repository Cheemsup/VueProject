<template>
  <div class="page-content">
    <h2>账户设置</h2>
    <el-form label-width="120px">
      <el-form-item label="通知设置">
        <el-switch v-model="localSettings.notifications" />
      </el-form-item>
      <el-form-item label="消息提醒">
        <el-switch v-model="localSettings.messageAlert" />
      </el-form-item>
      <el-form-item label="语言">
        <el-select v-model="localSettings.language">
          <el-option label="中文" value="zh" />
          <el-option label="English" value="en" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'

export default {
  name: 'UserSettings',
  props: {
    settings: {
      type: Object,
      required: true
    }
  },
  emits: ['update:settings'],
  setup(props, { emit }) {
    const localSettings = ref({ ...props.settings })

    watch(() => props.settings, (newVal) => {
      localSettings.value = { ...newVal }
    }, { deep: true })

    const saveSettings = () => {
      emit('update:settings', localSettings.value)
      ElMessage.success('设置已保存')
    }

    return {
      localSettings,
      saveSettings
    }
  }
}
</script>

<style scoped>
.page-content h2 {
  margin: 0 0 20px 0;
  color: #303133;
}
</style>