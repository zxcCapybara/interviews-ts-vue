<template>
<span class="loader"></span>
</template>

<style scoped>
.loader {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: inline-block;
  border-top: 3px solid #111111;
  border-right: 3px solid transparent;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
} 
</style>