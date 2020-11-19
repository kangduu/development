### 本地生成 SSH Key

```
// 默认 
// -t 指定密钥类型 rsa
// -C 密钥的注释（注意是大写）
ssh-keygen -t rsa -C '1365271643@qq.com'

// 添加密钥名称 `-f ~/.ssh/kangduu_rsa` 必须以rsa结尾
ssh-keygen -t rsa -f ~/.ssh/kangduu_rsa -C 'dukang1127@163.com'
```

![SSH_KEY](E:\kangduu_github\development\git\img\ssh_key.jpg)

### 本地公钥添加至GitHub中

- 在.ssh目录下新建config文件，内容如下：

```
Host github.com_KAngJoin //随便
    User git
    HostName github.com:KAngJoin //远程服务器地址clone地址@后面的地址（重要）
    PreferredAuthentications publickey // 必须
    IdentityFile ~/.ssh/KAngJoin_rsa //对应密钥

Host github.com_kangduu
    User git
    HostName github.com:kangduu
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/kangduu_rsa
```

- 将`kangduu_rsa.pub` 文件内容复制后（不换行）粘贴到GitHub中	

### 验证ssh

```
ssh -T git@github.com
```