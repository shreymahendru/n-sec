using System;
using System.Linq;
using System.Reflection;
using System.Text;

namespace SecurityCore
{
    internal class CommandHandler
    {
        private readonly string _command;
        private string _commandClass;
        private string _commandMethod;
        private string[] _commandArgs;
        
        
        public CommandHandler(string command)
        {
            this._command = command;
            this.Parse();
        }
        
        
        public string Handle()
        {
            var type = Assembly.GetExecutingAssembly().GetTypes().First(t => t.Name == this._commandClass);
            var method = type.GetMethods().First(t => t.Name == this._commandMethod);
            
            var result = method.Invoke(null, this._commandArgs);
            return result.ToString();
        }
        
        
        private void Parse()
        {
            var input = this._command;
            
            if(input.Contains("::"))
            {
                var inputSplitted = this.Split(input, "::");
                input = inputSplitted[0];
                var arguments = Encoding.UTF8.GetString(Convert.FromBase64String(inputSplitted[1]));
                this._commandArgs = arguments.Contains(",") ? this.Split(arguments, ",") : new []{arguments};
            }
            
            var invocationSplitted = Split(input, ".");
            this._commandClass = invocationSplitted[0];
            this._commandMethod = invocationSplitted[1];
        }
        
        
        private string[] Split(string value, string splitter)
        {
            return value.Split(splitter, StringSplitOptions.RemoveEmptyEntries).Select(t => t.Trim()).ToArray();
        }
    }
}