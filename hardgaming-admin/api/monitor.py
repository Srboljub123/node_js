try:
    import psutil, re, time, mysql.connector
    from psutil._common import bytes2human
    
except ImportError:
    from pip._internal import main as pip
    pip(['install', '--user', 'psutil', 'mysql.connector'])
    import psutil, re, time
    
def insert_variables_into_table(network, disk, memory, CPU):
    try:
        connection = mysql.connector.connect(user='root', password='PASSWORDHERE', host='IPADDRESSHERE', database='mydb')
        cursor = connection.cursor()
        mySql_insert_query = """INSERT INTO Laptop (network, disk, memory, CPU) VALUES (%s, %s, %s, %s) """
        record = (network, disk, memory, CPU)
        cursor.execute(mySql_insert_query, record)
        connection.commit()
        print("Failed to insert into MySQL table {}".format(error))
        
        
CPUload = psutil.cpu_percent()

memload = psutil.virtual_memory().percent
memtotal = bytes2human(psutil.virtual_memory().total)
memfree = bytes2human(psutil.virtual_memory().free)

diskload = psutil.disk_usage('/').percent
disktotal = bytes2human(psutil.disk_usage('/').total)
diskfree = bytes2human(psutil.disk_usage('/').free)

interface = "ADDINTERFACEHERE"
net_stat = psutil.net_io_counters(pernic=True, nowrap=True)[interface]
net_in = bytes2human(net_stat.bytes_recv)
net_out = bytes2human(net_stat.bytes_sent)

sensor = psutil.sensors_temperatures()

print(net_in)