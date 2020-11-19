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
Host KAngJoin.github.com //随便，多个时不可相同，用于验证ssh
    User git
    HostName github.com //远程服务器地址clone地址@后面的地址（重要）
    PreferredAuthentications publickey // 必须
    IdentityFile ~/.ssh/KAngJoin_rsa //对应密钥

Host kangduu.github.com
    User git
    HostName github.com
    PreferredAuthentications publickey
    IdentityFile ~/.ssh/kangduu_rsa
```

- 将`kangduu_rsa.pub` 文件内容复制后（不换行）粘贴到GitHub中	

### 验证ssh

```
// 命令
ssh -T git@kangduu.github.com

// 成功
$ ssh -T git@kangduu.github.com
Hi kangduu! You've successfully authenticated, but GitHub does not provide shell access.

// 失败
$ ssh -T git@kangduu.github.com
Warning: Permanently added the RSA host key for IP address '192.30.255.112' to the list of known hosts.
git@kangduu.github.com: Permission denied (publickey).

```

### 免密pull push