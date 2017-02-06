function solve() {
  
  const Validators = {
    
    validateType(input, expectedType){
      if(typeof input !== expectedType){
        if(expectedType === 'string'){
          throw new Error(`Name must be ${expectedType}!`);
        }
      }
    },
    validateRange(inputType, input, min, max){
      if(typeof input === 'string'){
        if(input.length < min || input.length > max){
          throw new Error(`Name must be between between ${min} and ${max} symbols long!`);
        }
      };
      if(typeof input === 'number'){
        if(input < min || input > max){
          if(inputType === 'mana'){
            throw new Error(`Mana must be a positive integer number!`);
          }
          if(inputType === 'damage'){
            throw new Error(`Damage must be a positive number that is at most 100!`);
          }
          if(inputType === 'health'){
            throw new Error(`Health must be a positive number that is at most 200!`);
          }
          if(inputType === 'count'){
            throw new Error(`Count must be a positive integer number!`);
          }
          if(inputType === 'speed'){
            throw new Error(`Speed must be a positive number that is at most 100!`);
          }
        }
      };

    },
    validateSymbols(value){
      if(value.toString().match(/[^A-Za-z ]/)){
        throw new Error(`Name can contain only latin symbols and whitespaces!`);
      }
    },
    validateEffect(value){
      if(typeof value !== 'function' || value.length !== 1){
        throw new Error(`Effect must be a function with 1 parameter!`);
      }
        
    },
    validateAlignment(value){
      var alignments = ['good', 'neutral', 'evil'];
      if(alignments.indexOf(value) === -1){
        
        throw new Error('Alignment must be good, neutral or evil!');
      }
    }
    
  };
  
  class Spell {
    
    constructor(name, manaCost, effect){
      this.name = name;
      this.manaCost = manaCost;
      this.effect = effect;
    }
    
    get name(){
      return this._name;
    }
    set name(value){
      Validators.validateType(value, 'string');
      Validators.validateRange('name', value, 2, 20);
      Validators.validateSymbols(value);
      this._name = value;
    }
    
    get manaCost(){
      return this._manaCost;
    }
    set manaCost(value){
      Validators.validateRange('mana', value, 0, Infinity)
      this._manaCost = value;
    }
    
    get effect(){
      return this._effect;
    }
    set effect(value){
      Validators.validateEffect(value);
      this._effect = value;
    }
  }
  
  class Unit {
    
    constructor(name, alignment){
      this.name = name;
      this.alignment = alignment; 
    }
    
    get name(){
      return this._name;
    }
    set name(value){
      Validators.validateType(value);
      Validators.validateRange(value);
      Validators.validateSymbols(value);
      this._name = value;
    }
    
    get alignment(){
      return this._alignment;
    }
    set alignment(value){
      Validators.validateAlignment(value);
      this._alignment = value;
    }
  }
  
  var generatedId = 0;
  
  function generateId(){
    return generatedId++;
  }
  
  class ArmyUnit extends Unit {
     
    constructor(name, alignment, damage, health, count, speed){
      super(name, alignment);
      this.id = generateId();
      
      this.damage = damage;
      this.health = health;
      this.count = count;
      this.speed = speed;
    }
    
    get damage(){
      return this._damage;
    }
    set damage(value){
      Validators.validateRange('damage', value, 0, 100);
      this._damage = value;
    }
    get health(){
      return this._damage;
    }
    set health(value){
      Validators.validateRange('health', value, 0, 200);
      this._health = value;
    }
    get count(){
      return this._damage;
    }
    set count(value){
      Validators.validateRange('count', value, 0, Infinity);
      this._count = value;
    }
    get speed(){
      return this._damage;
    }
    set speed(value){
      Validators.validateRange('speed', value, 0, 100);
      this._speed = value;
    }
  }
  
  class Commander extends Unit{
    constructor(name, alignment, mana){
      super(name, alignment);
      this.mana = mana;
      this.spellbook = [];
      this.army = [];
    }
    
    get mana(){
      return this._mana;
    }
    set mana(value){
      Validators.validateRange('mana', value, 0, Infinity);
      this._mana = value;
    }
  }
  
  class Battlemanager {
    
    constructor(){
      this.commanders = [];
      this.armyUnits = [];
    }
    
    getCommander(name, alignment, mana){
      return new Commander(name, alignment, mana);
    }
    
    getArmyUnit(options){
      var newArmyUnit = new ArmyUnit(options.name,
                                     options.alignment,
                                     options.damage,
                                     options.health,
                                     options.count,
                                     options.speed
                                    );
      this.armyUnits.push(newArmyUnit);
      return newArmyUnit;
    }
    
    getSpell(name, manaCost, effect){
      return new Spell(name, manaCost, effect);
    }
    addCommanders(...commandersInput){
      this.commanders.push(...commandersInput);
      return this;
    }
    addArmyUnitTo(commanderName, ...armyUnits){
      var matchingCommander = this.commanders
        .find(commander => commander.name === commanderName);
      matchingCommander.army.push(...armyUnits);
      return this;
    }
    addSpellsTo(commanderName, ...spells){
      var matchingCommander = this.commanders
        .find(commander => commander.name === commanderName);
      
      for(const spell of spells){
        try {
          Validators.validateType(spell.name, 'string');
          Validators.validateRange('name', spell.name, 2, 20);
          Validators.validateSymbols(spell.name);
          Validators.validateRange('mana', spell.manaCost, 0, Infinity);
          Validators.validateEffect(spell.effect);
        }
        catch (invalidSpellObjects){
          throw invalidSpellObjects = 'Passed objects must be Spell-like objects!';
        }
        
      } 
      matchingCommander.spellbook.push(...spells);
      return this;
    }
    findCommanders(query){
      var name = query.name;
      var alignment = query.alignment;
      var matchingCommanders;
      var queryLength = keys(query).length;
        if(queryLength === 1){
            matchingCommanders = this.commanders
              .filter(commander =>
                commander.name === name 
                || 
                commander.alignment === alignment);
        }
        else{
            matchingCommanders = this.commanders
              .filter(commander =>
                commander.name === name 
                && 
                commander.alignment === alignment);
        }
      return matchingCommanders.sort(
        function (a,b) {
          return a.name > b.name
        }
      );
      
    }
    findArmyUnitById(id){
      var matchingUnit = this.armyUnits.find(unit => unit.id === id);
      return matchingUnit; 
      
    }
    
    findArmyUnits(query){
      var id = query.id;
      var name = query.name;
      var alignment = query.alignment;
      var matchingUnits;
      var queryLength = keys(query).length;
      
      if(queryLength === 1){
        matchingUnits = this.armyUnits.filter(unit =>
          unit.id === id
          ||
          unit.name === name
          ||
          unit.alignment === alignment                
        );
      }
      else if(queryLength === 2){
        matchingUnits = this.armyUnits.filter(unit =>
          (unit.id === id
          &&
          unit.name === name)
          ||
          (unit.name === name
          &&
          unit.alignment === alignment)
          ||
          (unit.id === id
          &&
          unit.alignment === alignment)                             
        );                                      
      }
      else{
        matchingUnits = this.armyUnits.filter(unit =>
          (unit.id === id)
          &&
          (unit.name === name)
          &&
          (unit.alignment === alignment)              
        );                                    
      }
      matchingUnits = matchingUnits.sort(
        function sortUnits(a,b){
          if(a._speed !== b._speed){
            return a._speed < b._speed;
          }
          else{
            return a.name > b.name;
          }
        }
      );
      return matchingUnits;
    }
    spellcast(casterName, spellName, targetUnitId){
      var matchingCommander = this.commanders.find(commander => commander.name === casterName);
      if(matchingCommander === undefined){
        throw new Error(`Cannot cast with non-existant commander ${casterName}`);
      }
      console.log(matchingCommander);
      var matchingSpell = matchingCommander.spellbook.find(spell => spell.name === spellName);
      if(matchingSpell === undefined){
        throw new Error(`${casterName} does not know ${spellName}`);
      }
      console.log(matchingSpell);
      var matchingEffect = matchingSpell.effect;
      console.log(matchingEffect);
      var matchingUnit = this.armyUnits.find(unit => unit.id === targetUnitId);
      if(matchingUnit === undefined){
        throw new Error(`Target not found!`);
      }
      console.log(targetUnitId);
      console.log(matchingCommander.mana);
      console.log(matchingSpell.manaCost);
      if(matchingCommander.mana < matchingSpell.manaCost){
        throw new Error(`Not enough mana!`);
      }
      else{
        matchingCommander.mana -= matchingSpell.manaCost;
      }
      console.log(matchingCommander.mana);
      matchingEffect(matchingUnit);
      return this;
      
    }
    battle(attacker, defender){
      var matchingAttacker = this.armyUnits.find(unit => unit.name === attacker.name);
      var matchingDefender = this.armyUnits.find(unit => unit.name === defender.name);
      console.log(matchingAttacker);
      if(matchingAttacker === undefined || matchingDefender === undefined){
        throw new Error(`Battle participants must be ArmyUnit-like!`);
      }
      
      var attTotalDamage = attacker._damage * attacker._count;
      console.log(attacker._damage);
      console.log(attacker._count);
      console.log(attTotalDamage);
      var defTotalHealth = defender._health * defender._count;
      console.log(defender._health);
      console.log(defender._count);
      console.log(defTotalHealth);
      defTotalHealth -= attTotalDamage;
      console.log(defTotalHealth);
      defender._count = Math.ceil(defTotalHealth / defender._health);
      console.log(defender._count);
      return this;
    }
  }
  
  //START DEVELOPMENT TESTS=========================================
  //================================================================
  //================================================================
  //================================================================
  
  var Battlemanager1 = new Battlemanager();
  console.log(Battlemanager1);
  
  var Zeratul = Battlemanager1.getCommander('Zeratul', 'neutral', 50);
  var Kerrigan = Battlemanager1.getCommander('Kerrigan', 'neutral', 200);
  
  console.log(Zeratul);

  var Footman = Battlemanager1.getArmyUnit({name: 'Footman',
                                            alignment: 'good',
                                            damage: 10,
                                            health: 75,
                                            speed: 40,
                                            count: 5
                                           });
  console.log(Footman);
  var Grunt = Battlemanager1.getArmyUnit({name: 'Grunt',
                                          alignment: 'good',
                                          damage: 12,
                                          health: 75,
                                          speed: 40,
                                          count: 5
                                           });
  
  var FrostShield = Battlemanager1.getSpell('Frost Shield', 50, function frostShield(target){});
  console.log(FrostShield);
  var FrostNova = Battlemanager1.getSpell('Frost Nova', 50, function frostNova(target){});
  
  Battlemanager1.addCommanders(Zeratul, Kerrigan);
  
  console.log(Battlemanager1.commanders[0]);
  
  Battlemanager1.addArmyUnitTo('Zeratul', Footman, Grunt);
  console.log(Zeratul.army);
  
  Battlemanager1.addSpellsTo('Zeratul', FrostShield, FrostNova);
  console.log(Zeratul.spellbook);
  
  console.log(Battlemanager1.findCommanders({alignment: 'neutral'}));
  
  console.log(Battlemanager1.findArmyUnitById(1));
  
  console.log(Battlemanager1.findArmyUnits({name: 'Footman',alignment: 'good'}));
  
  Battlemanager1.spellcast('Zeratul', 'Frost Shield', 1);
  
  Battlemanager1.battle(Footman, Grunt);
  
  //END DEVELOPMENT TESTS=========================================
  //================================================================
  //================================================================
  //================================================================
  
  //START TASK TESTS================================================
  //================================================================
  //================================================================
  //================================================================
  
  const battlemanager = new Battlemanager();

  const cyki = battlemanager.getCommander('Cyki', 'good', 15),
    koce = battlemanager.getCommander('Koce', 'good', 20);

  battlemanager.addCommanders(cyki, koce);

  const penguins = battlemanager.getArmyUnit({
        name: 'Penguin Warriors',
        alignment: 'neutral',
        damage: 15,
        health: 40,
        speed: 10,
        count: 120
    }),
    cavalry = battlemanager.getArmyUnit({
        name: 'Horsemen',
        alignment: 'good',
        damage: 40,
        health: 60,
        speed: 50,
        count: 50
    });

  const openVim = battlemanager.getSpell('Open vim', 10, target => target.damage -= 5),
    haste = battlemanager.getSpell('Haste', 5, target => target.speed += 5),
    callReinforcements = battlemanager.getSpell('Reinforcements', 10, target => target.count += 5)

  battlemanager
        .addArmyUnitTo('Cyki', penguins)
        .addSpellsTo('Cyki', openVim, haste)
        .addArmyUnitTo('Koce', cavalry)
        .addSpellsTo('Koce', haste, callReinforcements)
        .spellcast('Koce', 'Haste', cavalry.id)
        .spellcast('Cyki', 'OpenVim', cavalry.id)
        .battle(penguins, cavalry)
        .spellcast('Koce', 'Reinforcements', cavalry.id);
  
  //END TASK TESTS==================================================
  //================================================================
  //================================================================
  //================================================================
}
solve();
