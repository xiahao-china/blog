import React, {lazy, Suspense, useRef, useState} from "react";

import styles from './index.less';

function CreateArticle() {
  const [] = useState()
  const mdContainerRef = useRef(null);

  return (
    <div className={styles.createArticle}>
      <div className={styles.head}>
        <div className={styles.createTitle}>
          <input className={styles.createTitleInput} placeholder={'请输入文章标题'}/>
        </div>
        <div className={styles.saveAsDraft}>保存为草稿</div>
        <div className={styles.publish}>发布</div>
        <div className={styles.userInfo}>
          <img className={styles.headImg}/>
        </div>
        <div className={styles.loginBtn}>登录</div>
      </div>

      <div className={styles.markdownContainer} ref={mdContainerRef}>

      </div>

    </div>
  );
}

export default CreateArticle;
